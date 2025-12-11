// frontend_blog/src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import MetaTags from './MetaTags';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/public/articles`);
      if (response.data.success) {
        setArticles(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los artículos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando blog...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;

  return (
    <>
      <MetaTags 
        title="Laptops Gaming Blog - Las Mejores Reviews y Análisis 2024"
        description="Descubre las mejores laptops gaming del mercado. Reviews detalladas, comparativas, benchmarks y las últimas ofertas. Todo lo que necesitas saber para comprar tu laptop gaming ideal."
        keywords="laptops gaming, gaming laptops 2024, reviews laptops, análisis gaming, mejores laptops, ofertas gaming, RTX 4060, RTX 4070, Intel Core i7, AMD Ryzen"
      />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>🖥️ Blog de Laptops Gaming</h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            Las mejores reviews, análisis y ofertas de laptops gaming
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {articles.map((article) => (
            <article 
              key={article.id} 
              style={{ 
                border: '1px solid #eaeaea', 
                borderRadius: '10px', 
                overflow: 'hidden',
                boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                background: '#fff'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Link to={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {article.cover_image_url && (
                  <img 
                    src={article.cover_image_url} 
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div style={{ padding: '20px' }}>
                  <h2 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.5rem' }}>
                    {article.title}
                  </h2>
                  <p style={{ color: '#555', marginBottom: '15px' }}>
                    {article.excerpt}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <small style={{ color: '#888' }}>
                      📅 {new Date(article.created_at).toLocaleDateString()}
                    </small>
                    <span style={{ 
                      padding: '3px 8px', 
                      background: '#4caf50', 
                      color: 'white', 
                      borderRadius: '3px', 
                      fontSize: '12px' 
                    }}>
                      Leer más
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h3>No hay artículos publicados todavía</h3>
            <p>Vuelve pronto para ver contenido.</p>
          </div>
        )}

        <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
          <p>© {new Date().getFullYear()} Blog de Laptops Gaming. Todos los derechos reservados.</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Este blog contiene enlaces de afiliado. Las compras realizadas a través de estos enlaces nos ayudan a mantener el sitio.
          </p>
        </footer>
      </div>
    </>
  );
}

export default HomePage;