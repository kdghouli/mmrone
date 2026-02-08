import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white border-t border-gray-700">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="relative w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-lg"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Fleet Manager
                  </h2>
                  <p className="text-sm text-gray-400">
                    Gestion intelligente de flotte
                  </p>
                </div>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed">
                Solution complète de gestion de flotte automobile. Optimisez vos
                ressources, suivez vos véhicules et améliorez votre
                productivité.
              </p>
              <div className="flex space-x-4 pt-2">
                {[
                  {
                    icon: <FaFacebook />,
                    label: "Facebook",
                    color: "hover:text-blue-400",
                  },
                  {
                    icon: <FaTwitter />,
                    label: "Twitter",
                    color: "hover:text-sky-400",
                  },
                  {
                    icon: <FaLinkedin />,
                    label: "LinkedIn",
                    color: "hover:text-blue-500",
                  },
                  {
                    icon: <FaInstagram />,
                    label: "Instagram",
                    color: "hover:text-pink-500",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 border border-gray-700 text-gray-400 ${social.color} hover:border-current transition-all duration-300 transform hover:-translate-y-1`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-gray-700 inline-block">
                Navigation Rapide
              </h3>
              <ul className="space-y-3">
                {[
                  { path: "/", label: "Tableau de bord" },
                  { path: "/agences", label: "Nos agences" },
                  { path: "/camions", label: "Flotte camions" },
                  { path: "/voitures", label: "Flotte voitures" },
                  { path: "/maintenance", label: "Maintenance" },
                  { path: "/reports", label: "Rapports" },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-gray-700 inline-block">
                Nos Avantages
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    icon: <FaShieldAlt className="text-blue-400" />,
                    text: "Sécurité garantie",
                  },
                  {
                    icon: <FaTachometerAlt className="text-green-400" />,
                    text: "Suivi en temps réel",
                  },
                  {
                    icon: <FaUsers className="text-purple-400" />,
                    text: "Support 24/7",
                  },
                ].map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-800/50 rounded-lg">
                      {feature.icon}
                    </div>
                    <span className="text-gray-300 text-sm">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-700 inline-block">
                Contactez-nous
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800/50 rounded-lg">
                    <FaEnvelope className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a
                      href="mailto:contact@fleetmanager.com"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      contact@fleetmanager.com
                    </a>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800/50 rounded-lg">
                    <FaPhone className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Téléphone</p>
                    <a
                      href="tel:+212600000000"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      +212 6 66 53 51 77
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-800/50 rounded-lg mt-1">
                    <FaMapMarkerAlt className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Adresse</p>
                    <p className="text-gray-300">Marrakech, Maroc</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="max-w-lg mx-auto text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                Restez informé
              </h3>
              <p className="text-gray-400 mb-6">
                Inscrivez-vous à notre newsletter pour recevoir les dernières
                actualités.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  S'inscrire
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © {currentYear} Fleet Manager. Tous droits réservés.
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Conditions d'utilisation
                </Link>
                <Link
                  to="/cookies"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookies
                </Link>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Version 2.0.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 z-40 flex items-center justify-center"
          aria-label="Retour en haut"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </footer>
    </>
  );
}

export default Footer;
