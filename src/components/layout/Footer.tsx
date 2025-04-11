import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-inner py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and description */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-lg font-bold text-primary">StartupRadar</span>
            </Link>
            <p className="text-gray-600 text-sm mt-2 max-w-md">
              Real-time funding data and trends for startups across industries. Track investors, funding rounds, and market insights.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-10">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-primary text-sm transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/investors" className="text-gray-600 hover:text-primary text-sm transition-colors">
                    Investors
                  </Link>
                </li>
                <li>
                  <Link to="/trends" className="text-gray-600 hover:text-primary text-sm transition-colors">
                    Trends
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social links */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Connect</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <FiGithub size={18} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <FiTwitter size={18} />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} StartupRadar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 