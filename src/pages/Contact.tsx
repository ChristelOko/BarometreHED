import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send } from 'lucide-react';
import Button from '../components/common/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

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
            Contactez-nous
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <MessageCircle size={24} className="text-primary mr-2" />
                <h3 className="font-display text-xl">Chat en direct</h3>
              </div>
              <p className="text-neutral-dark/80 mb-4">
                Discutez avec une guide Human Design pour des réponses immédiates à vos questions.
              </p>
              <a
                href="https://wa.me/33600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                Démarrer une conversation
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Mail size={24} className="text-primary mr-2" />
                <h3 className="font-display text-xl">Email</h3>
              </div>
              <p className="text-neutral-dark/80 mb-4">
                Pour toute question ou demande spécifique, écrivez-nous directement.
              </p>
              <a
                href="mailto:contact@barometre-energetique.com"
                className="inline-flex items-center text-primary hover:underline"
              >
                contact@barometre-energetique.com
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="font-display text-2xl mb-6 text-center">
              Formulaire de contact
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-dark mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-dark mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field"
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                icon={<Send size={18} />}
              >
                Envoyer le message
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;