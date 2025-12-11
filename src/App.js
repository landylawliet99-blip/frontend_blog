// frontend_blog/src/App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';
import PublicArticle from './components/PublicArticle';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductLinks from './components/ProductLinks';
import Login from './components/Login';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAdminAccess, setShowAdminAccess] = useState(false);

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
    setUser(userData.user || userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.hash = '#/';
  };

  const handlePlaceholderLink = (e, message) => {
    e.preventDefault();
    alert(`${message} - Esta funcionalidad está en desarrollo.`);
  };

  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          {!isAuthenticated ? (
            <>
              <header style={{
                backgroundColor: '#1a1a1a',
                padding: '20px 0',
                borderBottom: '3px solid #ff6b00'
              }}>
                <div style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 20px'
                }}>
                  <Link to="/" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '2rem' }}>🎮</span>
                    <div>
                      <div style={{ lineHeight: '1.2' }}>LAPTOPS GAMING</div>
                      <div style={{ fontSize: '0.8rem', color: '#ccc', fontWeight: 'normal' }}>Reviews, Análisis y Guías</div>
                    </div>
                  </Link>

                  <nav style={{
                    display: 'flex',
                    gap: '30px',
                    alignItems: 'center'
                  }}>
                    <Link to="/" style={{
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '500',
                      transition: 'color 0.3s'
                    }} onMouseEnter={e => e.target.style.color = '#ff6b00'}
                      onMouseLeave={e => e.target.style.color = '#fff'}>
                      Inicio
                    </Link>
                    
                    <button
                      onClick={(e) => handlePlaceholderLink(e, 'Categoría: Reviews')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ccc',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={e => {
                        e.target.style.color = '#ff6b00';
                        e.target.style.backgroundColor = 'rgba(255, 107, 0, 0.1)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.color = '#ccc';
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      Reviews
                    </button>
                    
                    <button
                      onClick={(e) => handlePlaceholderLink(e, 'Categoría: Guías')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ccc',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={e => {
                        e.target.style.color = '#ff6b00';
                        e.target.style.backgroundColor = 'rgba(255, 107, 0, 0.1)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.color = '#ccc';
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      Guías
                    </button>
                    
                    <button
                      onClick={(e) => handlePlaceholderLink(e, 'Categoría: Ofertas')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ccc',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={e => {
                        e.target.style.color = '#ff6b00';
                        e.target.style.backgroundColor = 'rgba(255, 107, 0, 0.1)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.color = '#ccc';
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      Ofertas
                    </button>

                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setShowAdminAccess(!showAdminAccess)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #666',
                          color: '#ccc',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => {
                          e.target.style.borderColor = '#ff6b00';
                          e.target.style.color = '#fff';
                        }}
                        onMouseLeave={e => {
                          e.target.style.borderColor = '#666';
                          e.target.style.color = '#ccc';
                        }}
                      >
                        <span>🔐</span>
                        <span>Admin</span>
                      </button>
                      
                      {showAdminAccess && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          backgroundColor: '#2c3e50',
                          minWidth: '180px',
                          borderRadius: '4px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          zIndex: 1000,
                          marginTop: '5px',
                          padding: '15px'
                        }}>
                          <p style={{ color: '#ecf0f1', margin: '0 0 10px 0', fontSize: '0.9rem' }}>
                            Acceso al panel de administración
                          </p>
                          <Link 
                            to="/login" 
                            style={{
                              display: 'block',
                              padding: '10px',
                              backgroundColor: '#3498db',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            onClick={() => setShowAdminAccess(false)}
                          >
                            🔑 Iniciar Sesión
                          </Link>
                        </div>
                      )}
                    </div>
                  </nav>
                </div>
              </header>

              <main style={{ minHeight: 'calc(100vh - 200px)' }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/blog/:slug" element={<PublicArticle />} />
                  <Route path="/login" element={<Login onLogin={handleLogin} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </>
          ) : (
            <>
              <header style={{
                backgroundColor: '#1a1a1a',
                padding: '15px 0',
                borderBottom: '3px solid #3498db'
              }}>
                <div style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 20px'
                }}>
                  <div style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '2rem' }}>⚙️</span>
                    <div>
                      <div style={{ lineHeight: '1.2' }}>PANEL DE ADMINISTRACIÓN</div>
                      <div style={{ fontSize: '0.8rem', color: '#ccc', fontWeight: 'normal' }}>
                        Blog de Laptops Gaming
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to="/articles" style={{
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '8px 15px',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s'
                    }} onMouseEnter={e => e.target.style.backgroundColor = '#3498db'}
                      onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                      📝 Artículos
                    </Link>
                    
                    <Link to="/products" style={{
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '8px 15px',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s'
                    }} onMouseEnter={e => e.target.style.backgroundColor = '#3498db'}
                      onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                      🖥️ Productos
                    </Link>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ color: '#4caf50', fontSize: '0.9rem' }}>
                        👤 {user?.username || user?.email || 'Administrador'}
                      </span>
                      <button
                        onClick={handleLogout}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        🚪 Cerrar Sesión
                      </button>
                      
                      <Link to="/" style={{
                        padding: '8px 16px',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}>
                        👁️ Ver Blog
                      </Link>
                    </div>
                  </div>
                </div>
              </header>

              <main style={{ 
                minHeight: 'calc(100vh - 70px)',
                backgroundColor: '#f8f9fa',
                padding: '20px 0'
              }}>
                <Routes>
                  <Route path="/articles" element={<ArticleList />} />
                  <Route path="/articles/new" element={<ArticleForm />} />
                  <Route path="/articles/edit/:id" element={<ArticleForm />} />
                  
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/products/new" element={<ProductForm />} />
                  <Route path="/products/edit/:id" element={<ProductForm />} />
                  <Route path="/products/:id/links" element={<ProductLinks />} />
                  
                  <Route path="/" element={<Navigate to="/articles" />} />
                  <Route path="/login" element={<Navigate to="/articles" />} />
                  <Route path="/blog/:slug" element={<Navigate to="/" />} />
                  <Route path="*" element={<Navigate to="/articles" />} />
                </Routes>
              </main>
            </>
          )}

          <footer style={{
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '40px 20px 20px',
            marginTop: '50px'
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '40px'
            }}>
              <div>
                <h3 style={{ color: '#fff', marginBottom: '20px' }}>Laptops Gaming Blog</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Tu fuente confiable de reviews, análisis y guías sobre las mejores laptops gaming del mercado.
                </p>
                {!isAuthenticated && (
                  <Link to="/login" style={{
                    display: 'inline-block',
                    marginTop: '15px',
                    padding: '8px 15px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}>
                    🔐 Acceso Administrador
                  </Link>
                )}
              </div>

              <div>
                <h3 style={{ color: '#fff', marginBottom: '20px' }}>Enlaces</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/" style={{ color: '#bdc3c7', textDecoration: 'none' }}>
                      🏠 Inicio
                    </Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <button
                      onClick={(e) => handlePlaceholderLink(e, 'Categoría: Reviews')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#bdc3c7',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1rem',
                        textDecoration: 'none'
                      }}
                    >
                      ⭐ Reviews
                    </button>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <button
                      onClick={(e) => handlePlaceholderLink(e, 'Categoría: Ofertas')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#bdc3c7',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1rem',
                        textDecoration: 'none'
                      }}
                    >
                      💰 Ofertas
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 style={{ color: '#fff', marginBottom: '20px' }}>Legal</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <button
                      onClick={(e) => handlePlaceholderLink(e, 'Política de Privacidad')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#bdc3c7',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1rem',
                        textDecoration: 'none'
                      }}
                    >
                      🔒 Política de Privacidad
                    </button>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <button
                      onClick={(e) => handlePlaceholderLink(e, 'Términos de Uso')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#bdc3c7',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1rem',
                        textDecoration: 'none'
                      }}
                    >
                      📜 Términos de Uso
                    </button>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <button
                      onClick={(e) => handlePlaceholderLink(e, 'Enlaces de Afiliados')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#bdc3c7',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1rem',
                        textDecoration: 'none'
                      }}
                    >
                      🤝 Enlaces de Afiliados
                    </button>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <button
                      onClick={(e) => handlePlaceholderLink(e, 'Contacto')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#bdc3c7',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1rem',
                        textDecoration: 'none'
                      }}
                    >
                      📧 Contacto
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div style={{
              borderTop: '1px solid #4a6278',
              marginTop: '40px',
              paddingTop: '20px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
                © {new Date().getFullYear()} Laptops Gaming Blog. Todos los derechos reservados.
              </p>
              <p style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '10px' }}>
                <em>Este sitio contiene enlaces de afiliado. Las compras realizadas a través de estos enlaces 
                pueden generar una comisión que ayuda a mantener el sitio, sin costo adicional para ti.</em>
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;