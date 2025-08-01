import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../services/supabaseClient';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  phone?: string;
  birthdate?: string;
  hdType?: string;
  bio?: string;
  photo?: string | null;
  location?: string;
  website?: string;
  coverPhoto?: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string, name: string, hdType: string, bio: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) return { error };

          if (data.user) {
            // Essayer d'abord la table profiles
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            // Si pas de profil, essayer la table users
            let userInfo = profile;
            if (!profile) {
              const { data: userRecord } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .maybeSingle();
              
              if (userRecord) {
                userInfo = {
                  name: userRecord.full_name,
                  email: userRecord.email,
                  role: userRecord.role,
                  phone: userRecord.phone,
                  birthdate: userRecord.birthdate,
                  hd_type: userRecord.hd_type,
                  bio: userRecord.bio,
                  photo_url: userRecord.avatar_url
                };
              }
            }

            set({
              isAuthenticated: true,
              user: {
                id: data.user.id,
                email: data.user.email!,
                name: userInfo?.name || data.user.email?.split('@')[0] || '',
                role: userInfo?.role || 'user',
                phone: userInfo?.phone,
                birthdate: userInfo?.birthdate,
                hdType: userInfo?.hd_type,
                bio: userInfo?.bio,
                photo: userInfo?.photo_url,
              },
            });
          }
          return { error: null };
        } catch (error) {
          return { error: error as Error };
        }
      },
      register: async (email: string, password: string, name: string, hdType: string, bio: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) return { error };

          if (data.user) {
            // Créer le profil dans la table profiles
            const { error: profileError } = await supabase.from('profiles').insert([
              {
                id: data.user.id,
                name,
                email,
                hd_type: hdType,
                bio,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
            ]);

            if (profileError) return { error: profileError };

            // Créer aussi dans la table users pour la compatibilité
            const { error: userError } = await supabase.from('users').insert([
              {
                id: data.user.id,
                email,
                full_name: name,
                hd_type: hdType,
                bio,
                role: 'user',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
            ]);

            if (userError) {
              console.warn('Warning: Could not create user record:', userError);
              // Ne pas faire échouer l'inscription si seule la table users échoue
            }

            set({
              isAuthenticated: true,
              user: {
                id: data.user.id,
                email,
                name,
                role: 'user',
                hdType: hdType || 'generator',
                bio,
              },
            });

            // Créer automatiquement le profil public étendu
            try {
              await supabase.from('user_profiles_extended').insert([
                {
                  user_id: data.user.id,
                  is_verified: false,
                  profile_views_count: 0,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);

              // Créer les paramètres de confidentialité par défaut
              await supabase.from('user_privacy_settings').insert([
                {
                  user_id: data.user.id,
                  show_stats: true,
                  show_posts: true,
                  show_hd_type: true,
                  show_location: false,
                  show_website: true,
                  allow_messages: true,
                  allow_follow: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);
            } catch (profileError) {
              console.warn('Could not create extended profile:', profileError);
              // Ne pas faire échouer l'inscription si la création du profil étendu échoue
            }
          }
          return { error: null };
        } catch (error) {
          return { error: error as Error };
        }
      },
      logout: async () => {
        await supabase.auth.signOut();
        set({ isAuthenticated: false, user: null });
      },
      updateUser: async (updates) => {
        const { user } = useAuthStore.getState();
        if (!user?.id) return;

        try {
          // Préparer les données pour la table profiles
          const profileUpdates: any = {
            updated_at: new Date().toISOString()
          };
          
          // Mapper les champs pour la table profiles
          if (updates.name !== undefined) profileUpdates.name = updates.name;
          if (updates.email !== undefined) profileUpdates.email = updates.email;
          if (updates.phone !== undefined) profileUpdates.phone = updates.phone;
          if (updates.bio !== undefined) profileUpdates.bio = updates.bio;
          if (updates.hdType !== undefined) profileUpdates.hd_type = updates.hdType;
          if (updates.photo !== undefined) profileUpdates.photo_url = updates.photo;
          if (updates.birthdate !== undefined) {
            profileUpdates.birthdate = updates.birthdate === '' ? null : updates.birthdate;
          }

          // Mettre à jour la table profiles
          const { error: profileError } = await supabase
            .from('profiles')
            .update(profileUpdates)
            .eq('id', user.id);

          if (profileError) {
            console.error('Profile update error:', profileError);
            console.warn('Warning: Could not update profiles table:', profileError);
          }

          // Synchroniser avec la table users pour l'annuaire
          const userUpdates: any = {
            updated_at: new Date().toISOString()
          };
          
          if (updates.name !== undefined) userUpdates.full_name = updates.name;
          if (updates.email !== undefined) userUpdates.email = updates.email;
          if (updates.phone !== undefined) userUpdates.phone = updates.phone;
          if (updates.bio !== undefined) userUpdates.bio = updates.bio;
          if (updates.hdType !== undefined) userUpdates.hd_type = updates.hdType;
          if (updates.photo !== undefined) userUpdates.avatar_url = updates.photo;
          if (updates.birthdate !== undefined) {
            userUpdates.birthdate = updates.birthdate === '' ? null : updates.birthdate;
          }

          // Mettre à jour la table users pour l'annuaire
          const { error: userError } = await supabase
            .from('users')
            .update(userUpdates)
            .eq('id', user.id);

          if (userError) {
            console.error('User table update error:', userError);
            // Essayer de créer l'utilisateur s'il n'existe pas
            if (userError.code === 'PGRST116') {
              const { error: insertError } = await supabase
                .from('users')
                .insert({
                  id: user.id,
                  email: user.email,
                  full_name: updates.name || user.name,
                  hd_type: updates.hdType || user.hdType,
                  bio: updates.bio || user.bio,
                  avatar_url: updates.photo || user.photo,
                  phone: updates.phone || user.phone,
                  birthdate: updates.birthdate || user.birthdate,
                  role: 'user',
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
              
              if (insertError) {
                console.error('Could not create user record:', insertError);
              }
            }
          }

          // Gérer les champs étendus (location, website)
          const extendedFields: any = {};
          if (updates.location !== undefined) extendedFields.location = updates.location;
          if (updates.website !== undefined) extendedFields.website = updates.website;
          if (updates.coverPhoto !== undefined) extendedFields.cover_photo = updates.coverPhoto;

          if (Object.keys(extendedFields).length > 0) {
            extendedFields.updated_at = new Date().toISOString();
            
            const { error: extendedError } = await supabase
              .from('user_profiles_extended')
              .upsert({
                user_id: user.id,
                ...extendedFields
              }, {
                onConflict: 'user_id'
              });

            if (extendedError) {
              console.warn('Extended profile update warning:', extendedError);
              // Ne pas faire échouer pour les champs étendus
            }
          }

          // Mettre à jour le store local
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          }));

        } catch (error) {
          console.error('Error updating profile:', error);
          throw error;
        }
      
      // Déclencher un événement pour actualiser les autres composants
      window.dispatchEvent(new Event('userProfileUpdate'));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);