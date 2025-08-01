import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const Help = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "C'est quoi exactement le Baromètre Énergétique ?",
      answer: "C'est un outil d'auto-diagnostic simple et puissant, conçu pour les femmes. Il te permet de faire un scan de ton état intérieur (corps, cœur, tête, énergie) en quelques minutes, à l'instant T. L'idée : t'aider à prendre conscience de ce qui se passe en toi… et à te réaligner si besoin."
    },
    {
      question: "Comment ça fonctionne ?",
      answer: "Tu choisis une catégorie (ex : général, émotionnel, physique…) et tu coches les ressentis qui te parlent. L'app analyse les infos, identifie le ou les centres Human Design en jeu, te propose un score, une interprétation, et surtout des actions concrètes pour te réaligner."
    },
    {
      question: "Est-ce que c'est un diagnostic médical ?",
      answer: "Non, pas du tout. Le Baromètre repose sur une approche énergétique et spirituelle, fondée sur le Human Design. Il ne remplace jamais un avis médical, un thérapeute ou un professionnel de santé."
    },
    {
      question: "Je ne connais rien au Human Design. Je peux quand même utiliser l'app ?",
      answer: "Oui ! Tu peux faire un scan même sans connaître ton type. Mais si tu le renseignes (Projector, Generator, etc.), les conseils et interprétations seront personnalisés selon ton design énergétique."
    },
    {
      question: "Est-ce que c'est réservé aux femmes ?",
      answer: "Oui. L'univers HED a été conçu pour accompagner les femmes dans leur vécu intérieur, leur cycle, leur énergie fluctuante. C'est un espace de reconnexion féminine. Tu es chez toi ici."
    },
    {
      question: "Où puis-je utiliser le Baromètre ?",
      answer: "Tu peux l'utiliser via l'app web (version mobile-friendly) ou bientôt via WhatsApp grâce à La Guide HED, notre assistante spirituelle IA."
    },
    {
      question: "Est-ce que mes données sont protégées ?",
      answer: "Oui. Tes ressentis, ton profil HD et ton historique sont stockés de manière sécurisée. Rien n'est partagé, tout t'appartient."
    },
    {
      question: "À quoi sert le score énergétique ?",
      answer: "Le score donne une tendance générale de ton alignement à l'instant présent. Mais ce n'est pas une note. C'est un indicateur pour t'aider à écouter ton corps et ton intuition."
    },
    {
      question: "Est-ce que je peux suivre mon évolution ?",
      answer: "Oui. Ton tableau de bord te permet de voir les tendances, les ressentis fréquents, les centres souvent désalignés… pour comprendre tes propres cycles et mieux t'ajuster au quotidien."
    },
    {
      question: "Est-ce que tout est accessible gratuitement ?",
      answer: "Actuellement, oui. Pendant la phase de lancement, tout est ouvert. À terme, certaines fonctionnalités avancées (journal, tirage, catégories premium…) seront disponibles via un abonnement doux."
    }
  ];

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="font-display text-4xl text-center mb-8">
            🌿 FAQ — Baromètre Énergétique
          </h1>

          <div className="space-y-4 mb-12">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-start justify-between focus:outline-none"
                >
                  <h3 className="font-display text-xl flex items-center">
                    <span className="text-primary mr-3">🌀</span>
                    {item.question}
                  </h3>
                  <div className="ml-4 flex-shrink-0 text-primary">
                    {openFaqIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: openFaqIndex === index ? 'auto' : 0,
                    opacity: openFaqIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-neutral-dark/80 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-xl p-8 text-center">
            <h2 className="font-display text-2xl mb-6">
              Besoin d'aide supplémentaire ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://wa.me/34602256248"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <MessageCircle size={20} className="mr-2" />
                <span>Chat avec une guide</span>
              </a>
              <a
                href="mailto:contact@barometre-energetique.com"
                className="flex items-center justify-center p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <Mail size={20} className="mr-2" />
                <span>Nous contacter</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;