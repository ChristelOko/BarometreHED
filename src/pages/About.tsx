import { motion } from 'framer-motion';
import { Heart, Star, PenTool as Tool, AlertTriangle, CheckSquare, BookOpen, Sprout, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Bandeau beige avec padding supplémentaire */}
      <div className="h-[100px] bg-[#F9F1EE] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50"></div>
      </div>
      
      <div className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <PageHeader
              title="À propos du Baromètre Énergétique"
              subtitle="L'histoire de ce projet né du cœur"
            />
            
            {/* Introduction */}
            <div className={`${CARD_STYLES.elevated} mb-16`}>
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <img 
                  src="/CIA 2.png"
                  alt="Christel"
                  className="w-48 h-48 rounded-full object-cover shadow-lg"
                />
                <div className="space-y-6">
                  <p className="text-lg">
                    Je suis Christel, fondatrice du Baromètre Énergétique.
                  </p>
                  
                  <p className="text-lg">
                    J'ai créé cet outil avec le cœur grand ouvert, pour offrir aux femmes un espace de reconnexion 
                    à leur énergie, leur vérité et leur nature cyclique. Pendant des années, j'ai cherché des repères 
                    dans un monde qui va trop vite. Le Human Design m'a tendu la main. Puis les cycles lunaires ont 
                    résonné comme une évidence. Alors j'ai tissé un pont.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="font-display text-2xl mb-4 text-primary">
                  Ce pont, c'est le Baromètre.
                </p>
                
                <p className="text-neutral-dark/80 text-lg">
                  Un compagnon doux, précis, intuitif — qui ne te dit pas qui tu dois être, mais qui t'aide à 
                  entendre ce que ton corps, ton cœur, ton esprit savent déjà.
                </p>
              </div>
            </div>
            
            <section className="about-project">
              <h2 className="font-display text-3xl mb-8 flex items-center justify-center">
                <Heart className="text-primary mr-3" size={28} />
                Ce projet est né à trois
              </h2>
              
              <div className="grid gap-8 mb-16">
                <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-primary/10">
                  <div className="flex items-center mb-4">
                    <img 
                      src="/Manuela.png"
                      alt="Manuela"
                      className="w-24 h-24 rounded-full object-cover mr-4 shadow-md"
                    />
                    <div>
                      <h3 className="font-display text-xl">Manuela</h3>
                      <p className="text-primary">Ancrage émotionnel et énergétique</p>
                    </div>
                  </div>
                  <p className="text-neutral-dark/80">
                    Ma compagne est une experte en Human Design, qu'elle pratique depuis plus de cinq ans. Elle a toujours été, pour moi, une boussole vivante — une jauge intuitive et un régulateur énergétique dans les moments de doute ou de fatigue.
                    <br />
                    C'est elle qui veille à ce que chaque mot, chaque nuance du baromètre respecte la sagesse des cycles et du corps. Elle est mon miroir subtil, et la gardienne du souffle du féminin dans ce projet.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-secondary/10">
                  <div className="flex items-center mb-4">
                    <img 
                      src="/cardin.png"
                      alt="Cardini"
                      className="w-24 h-24 rounded-full object-cover mr-4 shadow-md"
                    />
                    <div>
                      <h3 className="font-display text-xl">Cardini</h3>
                      <p className="text-primary">Allié technique et bâtisseur digital</p>
                    </div>
                  </div>
                  <p className="text-neutral-dark/80">
                    C'est mon frère, mon allié technique et mon bâtisseur digital. Grâce à lui, cette vision a pu 
                    prendre forme dans un vrai site, fonctionnel, stable, élégant.
                    <br />
                    Il est discret mais brillant. Chaque fonctionnalité, chaque détail qui semble fluide en ligne, lui doit beaucoup. Il transforme 
                    mes intuitions en structures solides.
                  </p>
                </div>
              </div>

              <h2 className="font-display text-3xl mb-6 mt-12 flex items-center">
                <Sparkles className="text-primary mr-3" size={28} />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">✨ Inspiration</span>
              </h2>
              <div className="bg-white rounded-xl p-8 shadow-sm mb-6 border border-primary/10">
              <p className="text-neutral-dark/80 mb-4 text-lg leading-relaxed">
                Le Baromètre Énergétique est né d'un besoin viscéral de mieux écouter son corps, de faire le tri entre ressenti profond et surcharge mentale, et de créer un outil simple, intime et puissant pour retrouver l'alignement.
              </p>
              <p className="text-neutral-dark/80 mb-4 text-lg leading-relaxed">
                C'est en tant que <strong>Projector (2/4) avec autorité splénique</strong> que j'ai eu l'élan de concevoir ce projet : un compagnon énergétique incarné, guidé par le Human Design, pour toutes les femmes qui veulent se reconnecter à elles-mêmes.
              </p>
              <p className="text-neutral-dark/80 text-lg leading-relaxed">
                L'inspiration est venue dans un moment de désalignement personnel : j'avais besoin d'un miroir, pas d'un conseil.
                Je voulais un outil vivant, pas une application figée.
                Et surtout, je voulais honorer la sagesse des centres énergétiques, de la lune, des cycles et du silence.
              </p>
              </div>

              <h2 className="font-display text-3xl mb-6 mt-12 flex items-center">
                <BookOpen className="text-primary mr-3" size={28} />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">🔍 Ce que fait l'application</span>
              </h2>
              <div className="bg-white rounded-xl p-8 shadow-sm mb-8 border border-secondary/10">
              <ul className="space-y-4 text-neutral-dark/80">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-primary text-sm">1</span>
                  </div>
                  <span className="text-lg">Scanner son état intérieur selon 9 catégories : Général, Émotionnel, Physique, Mental, Digestif, Sensoriel, Énergétique, Cycle Féminin, HD Spécifique</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-primary text-sm">2</span>
                  </div>
                  <span className="text-lg">Choisir ses ressentis du moment, parmi une base détaillée et intuitive</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-primary text-sm">3</span>
                  </div>
                  <span className="text-lg">Recevoir un <strong>score énergétique global</strong>, les <strong>centres HD affectés</strong>, une <strong>guidance personnalisée</strong> selon son type HD, un mantra et un exercice de réalignement</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-primary text-sm">4</span>
                  </div>
                  <span className="text-lg">Explorer l'analyse détaillée de chaque ressenti : description, origine probable, phrase miroir, centre affecté</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <span className="text-primary text-sm">5</span>
                  </div>
                  <span className="text-lg">Accéder à un <strong>tableau de bord</strong> pour suivre l'évolution, des rappels personnalisés, une expérience mobile-first fluide et 100 % alignée à son profil</span>
                </li>
              </ul>
              </div>

              <h2 className="font-display text-3xl mb-6 mt-12 flex items-center">
                <Tool className="text-primary mr-3" size={28} />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">🛠️ Comment je l'ai construite</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-primary/10 hover:shadow-md transition-shadow">
                  <h3 className="font-display text-xl mb-3 text-primary">Frontend</h3>
                  <p className="text-neutral-dark/80">React.js avec Vite, Tailwind CSS, Framer Motion</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary/10 hover:shadow-md transition-shadow">
                  <h3 className="font-display text-xl mb-3 text-secondary">Backend</h3>
                  <p className="text-neutral-dark/80">Supabase (auth, DB, Edge Functions)</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-accent/10 hover:shadow-md transition-shadow">
                  <h3 className="font-display text-xl mb-3 text-accent">Base de données</h3>
                  <p className="text-neutral-dark/80">Structure complexe avec relations entre ressentis, centres, types HD, scorings</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-primary/10 hover:shadow-md transition-shadow">
                  <h3 className="font-display text-xl mb-3 text-primary">Multilingue</h3>
                  <p className="text-neutral-dark/80">Système complet dans Supabase</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary/10 hover:shadow-md transition-shadow">
                  <h3 className="font-display text-xl mb-3 text-secondary">PWA</h3>
                  <p className="text-neutral-dark/80">Installation mobile avec cache offline</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-accent/10 hover:shadow-md transition-shadow">
                  <h3 className="font-display text-xl mb-3 text-accent">Stockage dynamique</h3>
                  <p className="text-neutral-dark/80">Tout le contenu est éditable dans Supabase</p>
                </div>
              </div>

              <h2 className="font-display text-3xl mb-6 mt-12 flex items-center">
                <AlertTriangle className="text-primary mr-3" size={28} />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">⚠️ Les défis rencontrés</span>
              </h2>
              <div className="bg-warning/10 rounded-xl p-8 shadow-sm mb-8 border border-warning/20">
              <ul className="space-y-4 text-neutral-dark/80">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <AlertTriangle size={16} className="text-warning" />
                  </div>
                  <span className="text-lg">Les bugs aléatoires de Bolt (dupliquer des composants, affichages conditionnels bancals…)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <AlertTriangle size={16} className="text-warning" />
                  </div>
                  <span className="text-lg">Les nuits blanches à résoudre des erreurs CORS ou des Edge Functions têtues</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <AlertTriangle size={16} className="text-warning" />
                  </div>
                  <span className="text-lg">La complexité de Supabase (RLS, permissions, relations multiples…)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <AlertTriangle size={16} className="text-warning" />
                  </div>
                  <span className="text-lg">Le financement perso des tokens (aucune équipe, aucun budget… que la foi)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <AlertTriangle size={16} className="text-warning" />
                  </div>
                  <span className="text-lg">Le volume massif de contenu à structurer (225 ressentis x 5 champs analytiques…)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <AlertTriangle size={16} className="text-warning" />
                  </div>
                  <span className="text-lg">La pression des délais du concours : 4 semaines en solo, c'est un marathon-sacrifice</span>
                </li>
              </ul>
              </div>

              <h2 className="font-display text-3xl mb-6 mt-12 flex items-center">
                <CheckSquare className="text-primary mr-3" size={28} />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">✅ Ce dont je suis fière</span>
              </h2>
              <div className="bg-success/10 rounded-xl p-8 shadow-sm mb-8 border border-success/20">
              <ul className="space-y-4 text-neutral-dark/80">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <CheckSquare size={16} className="text-success" />
                  </div>
                  <span className="text-lg">Avoir transformé une idée floue en une application fonctionnelle, sensible et concrète</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <CheckSquare size={16} className="text-success" />
                  </div>
                  <span className="text-lg">Être restée fidèle au Human Design, sans ésotérisme ni rigidité</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <CheckSquare size={16} className="text-success" />
                  </div>
                  <span className="text-lg">Avoir créé un outil de régulation, pas une appli gadget</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <CheckSquare size={16} className="text-success" />
                  </div>
                  <span className="text-lg">Avoir tenu, malgré les galères, les doutes, les insomnies</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <CheckSquare size={16} className="text-success" />
                  </div>
                  <span className="text-lg">Avoir écouté mon autorité intérieure, chaque jour</span>
                </li>
              </ul>
              </div>

              <h2 className="font-display text-3xl mb-6 mt-12 flex items-center">
                <Sprout className="text-primary mr-3" size={28} />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">🌱 Et maintenant ?</span>
              </h2>
              <div className="bg-primary/5 rounded-xl p-8 shadow-sm mb-8 border border-primary/20">
              <ul className="space-y-4 text-neutral-dark/80">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Sprout size={16} className="text-primary" />
                  </div>
                  <span className="text-lg">Déployer la version complète : rappels, notifications, export PDF, IA d'accompagnement ("La Guide HED")</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Sprout size={16} className="text-primary" />
                  </div>
                  <span className="text-lg">Connecter l'app au Journal de transformation, à ALIGN, et aux lectures du jour</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Sprout size={16} className="text-primary" />
                  </div>
                  <span className="text-lg">Permettre aux femmes de suivre leur évolution énergétique dans la durée</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Sprout size={16} className="text-primary" />
                  </div>
                  <span className="text-lg">Ajouter une connexion au calendrier lunaire, des rituels, des intégrations Telegram / WhatsApp</span>
                </li>
              </ul>
              </div>

              <div className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl italic font-display text-xl text-center my-12 shadow-sm border border-primary/20">
                "Quand une femme honore ses cycles et son énergie unique,<br />
                elle retrouve sa puissance naturelle."
              </div>
              
              <div className="text-center mt-16 bg-white rounded-xl p-8 shadow-sm border border-primary/10">
                <p className="text-xl text-neutral-dark/80">Bienvenue dans ton espace.</p>
                <p className="font-display text-2xl mt-3">Avec amour,</p>
                <p className="font-display text-3xl text-primary mt-1">Christel</p>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto my-6"></div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;