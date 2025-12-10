import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';
import PublicArticle from './components/PublicArticle';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductLinks from './components/ProductLinks';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <header style={{
            backgroundColor: '#282c34',
            padding: '20px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h1>🖥️ Blog de Laptops Gaming - Panel de Administración</h1>
            <p>Bienvenido, {user?.username} ({user?.email})</p>
            <nav style={{ marginTop: '20px' }}>
              <Link to="/" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>🏠 Inicio</Link>
              <Link to="/articles" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>📝 Artículos</Link>
              <Link to="/articles/new" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>➕ Nuevo Artículo</Link>
              <Link to="/products" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>🖥️ Productos</Link>
              <Link to="/products/new" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>➕ Nuevo Producto</Link>
              <button onClick={handleLogout} style={{
                marginLeft: '20px', padding: '8px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
              }}>Cerrar Sesión</button>
            </nav>
          </header>
        )}

        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/blog/:slug" element={<PublicArticle />} />
          
          {/* RUTAS PROTEGIDAS */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={
                <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                  <h2>📊 Panel de Control</h2>
                  <p>Selecciona una opción del menú superior</p>
                  <div style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '5px' }}>
                    <h3>📈 Estadísticas</h3>
                    <p>Usuario: <strong>{user?.username}</strong></p>
                    <p>Email: <strong>{user?.email}</strong></p>
                    <p>Rol: <strong>{user?.role}</strong></p>
                  </div>
                  <div style={{ marginTop: '30px', padding: '20px', background: '#e8f5e9', borderRadius: '5px' }}>
                    <h3>🚀 Acciones Rápidas</h3>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
                      <Link to="/articles/new" style={{
                        padding: '10px 20px',
                        background: '#4caf50',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        display: 'inline-block'
                      }}>
                        ➕ Nuevo Artículo
                      </Link>
                      <Link to="/products/new" style={{
                        padding: '10px 20px',
                        background: '#2196f3',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        display: 'inline-block'
                      }}>
                        🖥️ Nuevo Producto
                      </Link>
                      <Link to="/products" style={{
                        padding: '10px 20px',
                        background: '#9c27b0',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        display: 'inline-block'
                      }}>
                        🔗 Gestionar Enlaces
                      </Link>
                    </div>
                  </div>
                </div>
              } />
              
              {/* RUTAS DE ARTÍCULOS */}
              <Route path="/articles" element={<ArticleList />} />
              <Route path="/articles/new" element={<ArticleForm />} />
              <Route path="/articles/edit/:id" element={<ArticleForm />} />
              
              {/* RUTAS DE PRODUCTOS */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />
              <Route path="/products/:id/links" element={<ProductLinks />} />
            </>
          ) : (
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          )}
          
          {/* RUTA POR DEFECTO */}
          <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
        </Routes>

        <footer style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5' }}>
          <p>Backend API: http://localhost:3001</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
            © 2025 Blog de Laptops Gaming - Panel de Administración
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;