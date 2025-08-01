import { motion } from 'framer-motion';

const Legal = () => {
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
            Mentions légales
          </h1>

          <div className="bg-white rounded-xl p-8 shadow-sm space-y-8">
            <section>
              <h2 className="font-display text-2xl mb-4">Éditeur du site</h2>
              <p className="text-neutral-dark/80 leading-relaxed">
                Baromètre Énergétique<br />
                123 rue de l'Énergie<br />
                75000 Paris, France<br />
                contact@barometre-energetique.com
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl mb-4">Protection des données</h2>
              <p className="text-neutral-dark/80 leading-relaxed">
                Conformément à la loi "Informatique et Libertés" du 6 janvier 1978, vous disposez d'un droit d'accès, de modification et de suppression des données vous concernant. Pour exercer ce droit, veuillez nous contacter par email.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl mb-4">Propriété intellectuelle</h2>
              <p className="text-neutral-dark/80 leading-relaxed">
                L'ensemble du contenu de ce site (textes, images, vidéos) est protégé par le droit d'auteur. Toute reproduction, même partielle, est soumise à notre autorisation préalable.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl mb-4">Cookies</h2>
              <p className="text-neutral-dark/80 leading-relaxed">
                Ce site utilise des cookies pour améliorer votre expérience de navigation. En continuant à naviguer sur ce site, vous acceptez leur utilisation.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl mb-4">Responsabilité</h2>
              <p className="text-neutral-dark/80 leading-relaxed">
                Les informations fournies sur ce site le sont à titre indicatif. L'utilisateur est seul responsable de l'utilisation qu'il fait des informations et contenus disponibles sur ce site.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Legal;