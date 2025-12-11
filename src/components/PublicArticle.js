// frontend_blog/src/components/PublicArticle.js (CORREGIDO)
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import MetaTags from './MetaTags';

function PublicArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar useCallback para memoizar la función fetchArticle
  const fetchArticle = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/public/articles/${slug}`);
      if (response.data.success) {
        setArticle(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el artículo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]); // slug es una dependencia

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]); // fetchArticle es una dependencia (memoizada con useCallback)

  const createMarkup = (html) => {
    return { __html: html };
  };

  const storeConfig = {
    amazon: { 
      name: 'Amazon', 
      color: '#FF9900', 
      icon: '🛒',
      shortName: 'Amazon'
    },
    walmart: { 
      name: 'Walmart', 
      color: '#0071ce', 
      icon: '🏪',
      shortName: 'Walmart'
    },
    bestbuy: { 
      name: 'Best Buy', 
      color: '#0046be', 
      icon: '🔵',
      shortName: 'Best Buy'
    },
    newegg: { 
      name: 'Newegg', 
      color: '#cc0000', 
      icon: '🥚',
      shortName: 'Newegg'
    },
    adorama: { 
      name: 'Adorama', 
      color: '#2a5caa', 
      icon: '📸',
      shortName: 'Adorama'
    },
    bhphoto: { 
      name: 'B&H Photo', 
      color: '#f37021', 
      icon: '🎥',
      shortName: 'B&H'
    },
    microcenter: { 
      name: 'Micro Center', 
      color: '#d2232a', 
      icon: '💻',
      shortName: 'Micro Center'
    },
  };

  const getStoreConfig = (storeKey) => {
    return storeConfig[storeKey] || { 
      name: storeKey, 
      color: '#6c757d', 
      icon: '🛍️',
      shortName: storeKey
    };
  };

  const formatPrice = (price) => {
    if (!price) return null;
    return `$${price.toFixed(2)}`;
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando artículo...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
  if (!article) return <div>Artículo no encontrado</div>;

  const products = article.article_products || [];

  return (
    <>
      <MetaTags 
        title={`${article.title} - Laptops Gaming Blog`}
        description={article.excerpt || `Análisis completo de ${article.title}. Especificaciones, rendimiento, pros y contras.`}
        keywords={`${article.title}, laptop gaming, review, análisis, especificaciones, precio`}
        type="article"
        image={article.cover_image_url || '/default-article-image.jpg'}
        publishedTime={article.created_at}
        modifiedTime={article.updated_at}
        category="Tecnología/Gaming"
      />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <article>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
              {article.title}
            </h1>
            
            {article.cover_image_url && (
              <img 
                src={article.cover_image_url} 
                alt={article.title}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}
              />
            )}
            
            <div style={{ 
              padding: '15px', 
              background: '#f8f9fa', 
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '1.1rem', color: '#555', margin: 0 }}>
                {article.excerpt}
              </p>
            </div>
            
            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              <span>📅 Publicado: {new Date(article.created_at).toLocaleDateString()}</span>
              <span style={{ marginLeft: '20px' }}>🏷️ {article.status === 'published' ? 'Publicado' : 'Borrador'}</span>
            </div>
          </header>

          <div 
            className="article-content"
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: '#333'
            }}
            dangerouslySetInnerHTML={createMarkup(article.content)}
          />

          {products.length > 0 && (
            <section style={{ marginTop: '50px' }}>
              <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                🖥️ Dónde Comprar los Productos Recomendados
              </h2>
              
              <p style={{ color: '#666', marginBottom: '30px' }}>
                Estos son los enlaces de compra para los productos mencionados. Las compras realizadas a través de estos enlaces nos ayudan a mantener el blog.
              </p>
              
              <div style={{ display: 'grid', gap: '30px', marginTop: '20px' }}>
                {products.map((ap) => {
                  const product = ap.products;
                  const affiliateLinks = product.affiliate_links || [];
                  
                  return (
                    <div 
                      key={product.id} 
                      style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '10px', 
                        padding: '25px',
                        background: '#fff',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '25px' }}>
                        {product.image_url && (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            style={{
                              width: '200px',
                              height: '150px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #eee'
                            }}
                          />
                        )}
                        
                        <div style={{ flex: 1 }}>
                          <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#2c3e50' }}>
                            {product.name}
                          </h3>
                          
                          {ap.review_notes && (
                            <p style={{ 
                              color: '#7f8c8d', 
                              marginBottom: '15px',
                              fontStyle: 'italic'
                            }}>
                              "{ap.review_notes}"
                            </p>
                          )}
                          
                          <div style={{ 
                            marginBottom: '25px', 
                            padding: '15px', 
                            background: '#f8f9fa', 
                            borderRadius: '5px'
                          }}>
                            <h4 style={{ marginBottom: '10px', color: '#34495e' }}>📋 Especificaciones Técnicas</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                              {product.specs.gpu && (
                                <div><strong>Gráfica:</strong> {product.specs.gpu}</div>
                              )}
                              {product.specs.cpu && (
                                <div><strong>Procesador:</strong> {product.specs.cpu}</div>
                              )}
                              {product.specs.ram && (
                                <div><strong>RAM:</strong> {product.specs.ram}</div>
                              )}
                              {product.specs.storage && (
                                <div><strong>Almacenamiento:</strong> {product.specs.storage}</div>
                              )}
                              {product.specs.display && (
                                <div><strong>Pantalla:</strong> {product.specs.display}</div>
                              )}
                            </div>
                          </div>
                          
                          {affiliateLinks.length > 0 && (
                            <div>
                              <h4 style={{ marginBottom: '15px', color: '#34495e' }}>🔗 Comprar en Tiendas</h4>
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                                gap: '15px'
                              }}>
                                {affiliateLinks
                                  .filter(link => link.is_active)
                                  .map((link) => {
                                    const store = getStoreConfig(link.store);
                                    
                                    return (
                                      <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          padding: '15px',
                                          background: store.color,
                                          color: 'white',
                                          textDecoration: 'none',
                                          borderRadius: '8px',
                                          fontWeight: 'bold',
                                          minHeight: '90px',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          transition: 'transform 0.2s, box-shadow 0.2s',
                                          boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
                                        }}
                                        onMouseOver={e => {
                                          e.currentTarget.style.transform = 'translateY(-3px)';
                                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                                        }}
                                        onMouseOut={e => {
                                          e.currentTarget.style.transform = 'translateY(0)';
                                          e.currentTarget.style.boxShadow = '0 3px 5px rgba(0,0,0,0.2)';
                                        }}
                                      >
                                        <div style={{ fontSize: '1.5em', marginBottom: '5px' }}>
                                          {store.icon}
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                          <div>{store.shortName}</div>
                                          {link.current_price && (
                                            <div style={{ 
                                              fontSize: '0.9em', 
                                              opacity: 0.9,
                                              marginTop: '3px'
                                            }}>
                                              {formatPrice(link.current_price)}
                                              {link.discount_percentage && (
                                                <span style={{ 
                                                  marginLeft: '8px',
                                                  background: 'rgba(255,255,255,0.3)',
                                                  padding: '2px 6px',
                                                  borderRadius: '3px',
                                                  fontSize: '0.8em'
                                                }}>
                                                  -{link.discount_percentage}%
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </a>
                                    );
                                  })}
                              </div>
                              <p style={{ 
                                marginTop: '15px', 
                                fontSize: '0.8rem', 
                                color: '#7f8c8d',
                                fontStyle: 'italic'
                              }}>
                                *Los precios pueden variar entre tiendas y cambiar sin previo aviso. Verifica el precio final antes de comprar.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <footer style={{ 
            marginTop: '50px', 
            paddingTop: '20px', 
            borderTop: '1px solid #eee',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            <div style={{ 
              padding: '15px', 
              background: '#e8f4f8', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p><strong>💡 Nota sobre enlaces de afiliado:</strong> Este artículo contiene enlaces de afiliado. Si realizas una compra a través de estos enlaces, recibimos una pequeña comisión sin costo adicional para ti. Esto nos ayuda a mantener el blog y seguir creando contenido de calidad.</p>
            </div>
            <p><strong>📝 Autor:</strong> {article.author_id || 'Equipo del Blog'}</p>
            <p><strong>🔄 Actualizado:</strong> {new Date(article.updated_at).toLocaleDateString()}</p>
          </footer>
        </article>
      </div>
    </>
  );
}

export default PublicArticle;