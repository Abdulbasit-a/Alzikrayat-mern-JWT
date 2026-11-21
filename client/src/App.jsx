// Routes configuration (React Router)

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import PhotoDetail from './pages/PhotoDetail';
import LoginRegister from './pages/LoginRegister';
import Upload from './pages/Upload';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />
        <Route path="/login" element={<LoginRegister mode="login" />} />
        <Route path="/register" element={<LoginRegister mode="register" />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
