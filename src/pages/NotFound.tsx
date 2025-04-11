import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <FiAlertCircle size={64} className="text-primary mb-6" />
      
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link to="/" className="btn-primary flex items-center">
        <FiHome className="mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound; 