import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit, Plus, Trash2, Globe, Save, Eye, Search, Filter } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAlertStore } from '../../store/alertStore';

interface ContentItem {
  id: string;
  page_slug: string;
  section_key: string;
  content_type: string;
  title: string;
  content: string;
  language: string;
  is_active: boolean;
  updated_at: string;
}

const ContentManagement = () => {
  const { showAlert } = useAlertStore();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [selectedPage, setSelectedPage] = useState('all');
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' }
  ];

  const pages = [
    { slug: 'home', name: 'Accueil' },
    { slug: 'scan', name: 'Diagnostic' },
    { slug: 'results', name: 'Résultats' },
    { slug: 'dashboard', name: 'Tableau de bord' },
    { slug: 'about', name: 'À propos' },
    { slug: 'help', name: 'Aide' },
    { slug: 'premium', name: 'Premium' }
  ];

  const contentTypes = [
    { value: 'text', label: 'Texte simple' },
    { value: 'hero', label: 'Section héro' },
    { value: 'feature', label: 'Fonctionnalité' },
    { value: 'step', label: 'Étape' },
    { value: 'testimonial', label: 'Témoignage' },
    { value: 'faq', label: 'FAQ' },
    { value: 'cta', label: 'Call to Action' }
  ];

  useEffect(() => {
    loadContents();
  }, [selectedLanguage, selectedPage]);

  const loadContents = async () => {
    try {
      setIsLoading(true);
      // Simuler le chargement du contenu
      const mockContents: ContentItem[] = [
        {
          id: '1',
          page_slug: 'home',
          section_key: 'hero_title',
          content_type: 'hero',
          title: 'Titre principal',
          content: 'Ressentez votre énergie profonde',
          language: 'fr',
          is_active: true,
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          page_slug: 'home',
          section_key: 'hero_subtitle',
          content_type: 'hero',
          title: 'Sous-titre',
          content: 'Explorez votre équilibre énergétique basé sur le Human Design.',
          language: 'fr',
          is_active: true,
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          page_slug: 'scan',
          section_key: 'welcome_message',
          content_type: 'text',
          title: 'Message de bienvenue',
          content: 'Quelle dimension veux-tu explorer ?',
          language: 'fr',
          is_active: true,
          updated_at: new Date().toISOString()
        }
      ];
      setContents(mockContents);
    } catch (error) {
      console.error('Error loading contents:', error);
      showAlert('Erreur lors du chargement du contenu', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = async (content: ContentItem) => {
    try {
      // Simuler la sauvegarde
      showAlert('Contenu sauvegardé avec succès', 'success');
      setEditingContent(null);
      loadContents();
    } catch (error) {
      showAlert('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Êtes-vous sûre de vouloir supprimer ce contenu ?')) return;
    
    try {
      // Simuler la suppression
      showAlert('Contenu supprimé avec succès', 'success');
      loadContents();
    } catch (error) {
      showAlert('Erreur lors de la suppression', 'error');
    }
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || content.language === selectedLanguage;
    const matchesPage = selectedPage === 'all' || content.page_slug === selectedPage;
    
    return matchesSearch && matchesLanguage && matchesPage;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-dark/70">Chargement du contenu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Gestion du contenu</h2>
          <p className="text-neutral-dark/70">
            Gérez le contenu multilingue de votre application
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
          icon={<Plus size={16} />}
        >
          Nouveau contenu
        </Button>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-[#2D2424] rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark/50" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Langue */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="input-field"
          >
            <option value="all">Toutes les langues</option>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>

          {/* Page */}
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="input-field"
          >
            <option value="all">Toutes les pages</option>
            {pages.map(page => (
              <option key={page.slug} value={page.slug}>
                {page.name}
              </option>
            ))}
          </select>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={loadContents}
              icon={<Filter size={16} />}
              fullWidth
            >
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Liste du contenu */}
      <div className="bg-white dark:bg-[#2D2424] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral/30">
                <th className="text-left py-4 px-6 font-medium">Contenu</th>
                <th className="text-left py-4 px-6 font-medium">Page</th>
                <th className="text-left py-4 px-6 font-medium">Type</th>
                <th className="text-left py-4 px-6 font-medium">Langue</th>
                <th className="text-left py-4 px-6 font-medium">Statut</th>
                <th className="text-left py-4 px-6 font-medium">Modifié</th>
                <th className="text-right py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-neutral-dark/70">
                    Aucun contenu trouvé
                  </td>
                </tr>
              ) : (
                filteredContents.map((content, index) => (
                  <motion.tr
                    key={content.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b border-neutral/10 ${
                      index % 2 === 0 ? 'bg-white dark:bg-[#2D2424]' : 'bg-neutral/5 dark:bg-[#3D3232]/20'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium">{content.title}</p>
                        <p className="text-sm text-neutral-dark/60 truncate max-w-xs">
                          {content.content}
                        </p>
                        <p className="text-xs text-neutral-dark/50 mt-1">
                          {content.section_key}
                        </p>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {pages.find(p => p.slug === content.page_slug)?.name || content.page_slug}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
                        {contentTypes.find(t => t.value === content.content_type)?.label || content.content_type}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="text-sm">
                        {languages.find(l => l.code === content.language)?.flag} {content.language.toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        content.is_active 
                          ? 'bg-success/10 text-success' 
                          : 'bg-error/10 text-error'
                      }`}>
                        {content.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="text-sm text-neutral-dark/70">
                        {new Date(content.updated_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setEditingContent(content)}
                          className="p-2 text-neutral-dark/70 hover:text-primary transition-colors rounded-full hover:bg-neutral/10"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {/* Prévisualiser */}}
                          className="p-2 text-neutral-dark/70 hover:text-secondary transition-colors rounded-full hover:bg-neutral/10"
                          title="Prévisualiser"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteContent(content.id)}
                          className="p-2 text-neutral-dark/70 hover:text-error transition-colors rounded-full hover:bg-error/10"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistiques du contenu */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-display text-primary">{contents.length}</div>
          <div className="text-sm text-neutral-dark/70">Contenus totaux</div>
        </div>
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-display text-success">
            {contents.filter(c => c.is_active).length}
          </div>
          <div className="text-sm text-neutral-dark/70">Contenus actifs</div>
        </div>
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-display text-secondary">
            {languages.length}
          </div>
          <div className="text-sm text-neutral-dark/70">Langues supportées</div>
        </div>
        <div className="bg-white dark:bg-[#2D2424] rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-display text-accent">
            {pages.length}
          </div>
          <div className="text-sm text-neutral-dark/70">Pages gérées</div>
        </div>
      </div>

      {/* Modal d'édition */}
      {editingContent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#2D2424] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="font-display text-xl mb-4">Modifier le contenu</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={editingContent.title}
                    onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Contenu
                  </label>
                  <textarea
                    value={editingContent.content}
                    onChange={(e) => setEditingContent({...editingContent, content: e.target.value})}
                    className="input-field"
                    rows={6}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      Page
                    </label>
                    <select
                      value={editingContent.page_slug}
                      onChange={(e) => setEditingContent({...editingContent, page_slug: e.target.value})}
                      className="input-field"
                    >
                      {pages.map(page => (
                        <option key={page.slug} value={page.slug}>
                          {page.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      Type
                    </label>
                    <select
                      value={editingContent.content_type}
                      onChange={(e) => setEditingContent({...editingContent, content_type: e.target.value})}
                      className="input-field"
                    >
                      {contentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={editingContent.is_active}
                    onChange={(e) => setEditingContent({...editingContent, is_active: e.target.checked})}
                  />
                  <label htmlFor="is_active" className="text-sm">Contenu actif</label>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setEditingContent(null)}
                  fullWidth
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSaveContent(editingContent)}
                  icon={<Save size={16} />}
                  fullWidth
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;