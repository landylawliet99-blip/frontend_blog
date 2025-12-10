import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';
import PublicArticle from './components/PublicArticle';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductLinks from './components/ProductLinks';
import Login from './components/Login';
import HomePage from './components/HomePage'; // IMPORTAR HomePage
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

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
    setShowAdminPanel(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setShowAdminPanel(false);
  };

  // Navbar Público - Para usuarios normales
  const PublicNavbar = () => (
    <nav style={{
      backgroundColor: '#1a1a1a',
      padding: '15px 20px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          🖥️ Blog de Laptops Gaming
        </Link>
      </div>
      <div>
        <Link to="/" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>Inicio</Link>
        {!isAuthenticated ? (
          <Link to="/login" style={{ 
            color: 'white', 
            margin: '0 15px', 
            textDecoration: 'none',
            padding: '8px 15px',
            background: '#4caf50',
            borderRadius: '4px'
          }}>Admin Login</Link>
        ) : (
          <button 
            onClick={() => setShowAdminPanel(true)}
            style={{
              padding: '8px 15px',
              background: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Panel Admin
          </button>
        )}
      </div>
    </nav>
  );

  // Navbar Admin - Solo para panel admin
  const AdminNavbar = () => (
    <header style={{
      backgroundColor: '#282c34',
      padding: '20px',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1>🖥️ Blog de Laptops Gaming - Panel de Administración</h1>
      <p>Bienvenido, {user?.username} ({user?.email})</p>
      <nav style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setShowAdminPanel(false)}
          style={{
            padding: '8px 15px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '15px'
          }}
        >
          ← Volver al Blog
        </button>
        <Link to="/admin" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>🏠 Inicio</Link>
        <Link to="/admin/articles" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>📝 Artículos</Link>
        <Link to="/admin/articles/new" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>➕ Nuevo Artículo</Link>
        <Link to="/admin/products" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>🖥️ Productos</Link>
        <Link to="/admin/products/new" style={{ color: 'white', margin: '0 15px', textDecoration: 'none' }}>➕ Nuevo Producto</Link>
        <button onClick={handleLogout} style={{
          marginLeft: '20px', padding: '8px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
        }}>Cerrar Sesión</button>
      </nav>
    </header>
  );

  return (
    <Router>
      <div className="App">
        {/* Mostrar Navbar dependiendo del contexto */}
        {showAdminPanel && isAuthenticated ? <AdminNavbar /> : <PublicNavbar />}

        <Routes>
          {/* ============ RUTAS PÚBLICAS ============ */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:slug" element={<PublicArticle />} />
          
          {/* ============ RUTA DE LOGIN ============ */}
          <Route path="/login" element={
            isAuthenticated ? (
              <Navigate to="/admin" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } />
          
          {/* ============ RUTAS PROTEGIDAS (ADMIN) ============ */}
          {isAuthenticated ? (
            <>
              <Route path="/admin" element={
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
                      <Link to="/admin/articles/new" style={{
                        padding: '10px 20px',
                        background: '#4caf50',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        display: 'inline-block'
                      }}>
                        ➕ Nuevo Artículo
                      </Link>
                      <Link to="/admin/products/new" style={{
                        padding: '10px 20px',
                        background: '#2196f3',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        display: 'inline-block'
                      }}>
                        🖥️ Nuevo Producto
                      </Link>
                      <Link to="/admin/products" style={{
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
              <Route path="/admin/articles" element={<ArticleList />} />
              <Route path="/admin/articles/new" element={<ArticleForm />} />
              <Route path="/admin/articles/edit/:id" element={<ArticleForm />} />
              
              {/* RUTAS DE PRODUCTOS */}
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/new" element={<ProductForm />} />
              <Route path="/admin/products/edit/:id" element={<ProductForm />} />
              <Route path="/admin/products/:id/links" element={<ProductLinks />} />
            </>
          ) : (
            // Si no está autenticado y trata de acceder a admin
            <Route path="/admin/*" element={<Navigate to="/login" />} />
          )}
          
          {/* RUTA POR DEFECTO */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Footer para todas las páginas */}
        <footer style={{ 
          marginTop: '40px', 
          padding: '20px', 
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #ddd'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Blog de Laptops Gaming</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Las mejores reviews y análisis de laptops gaming
                </p>
              </div>
              <div>
                {!isAuthenticated ? (
                  <Link to="/login" style={{ 
                    color: '#4caf50', 
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}>
                    🔐 Acceso Admin
                  </Link>
                ) : (
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    Conectado como: {user?.username}
                  </span>
                )}
              </div>
            </div>
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>
                © {new Date().getFullYear()} Blog de Laptops Gaming. Este sitio contiene enlaces de afiliado.
                API Backend: https://api-blog-09qt.onrender.com
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;