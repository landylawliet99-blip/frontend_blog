import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Configurar axios para enviar el token en todas las peticiones
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/articles`);
      if (response.data.success) {
        setArticles(response.data.data);
      }
    } catch (err) {
      // Si hay error 401 (no autorizado), redirigir al login
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      setError('Error al cargar los artículos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este artículo?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/articles/${id}`);
      alert('✅ Artículo eliminado');
      fetchArticles(); // Recargar la lista
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('❌ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      alert('❌ Error al eliminar: ' + err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Cargando artículos...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📝 Artículos del Blog ({articles.length})</h2>
        <button 
          onClick={() => navigate('/articles/new')}
          style={{
            padding: '8px 15px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ➕ Nuevo Artículo
        </button>
      </div>
      
      {articles.length === 0 ? (
        <p>No hay artículos todavía. ¡Crea el primero!</p>
      ) : (
        <div>
          {articles.map((article) => (
            <div key={article.id} style={{ 
              marginBottom: '15px', 
              padding: '15px', 
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{article.title}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666' }}>{article.excerpt}</p>
                </div>
                <div>
                  <span style={{
                    padding: '3px 8px',
                    background: article.status === 'published' ? '#4caf50' : '#ff9800',
                    color: 'white',
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}>
                    {article.status === 'published' ? '🚀 Publicado' : '📝 Borrador'}
                  </span>
                </div>
              </div>
              <small>
                <strong>Slug:</strong> {article.slug} | 
                <strong> Creado:</strong> {new Date(article.created_at).toLocaleDateString()}
              </small>
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => navigate(`/articles/edit/${article.id}`)}
                  style={{
                    padding: '5px 10px',
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => handleDelete(article.id)}
                  style={{
                    padding: '5px 10px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArticleList;