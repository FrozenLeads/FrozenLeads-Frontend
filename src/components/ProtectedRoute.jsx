import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>; // or spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
