import { Link } from "react-router-dom";

function Footer2() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-linear-to-b from-gray-900 to-gray-800 text-white border-t border-gray-700">
        <div className="bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-4 py-4">
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
      </footer>
    </>
  );
}

export default Footer2;
