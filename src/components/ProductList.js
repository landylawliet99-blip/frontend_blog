import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      setError('Error al cargar los productos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      alert('✅ Producto eliminado');
      fetchProducts();
    } catch (err) {
      alert('❌ Error al eliminar: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando productos...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🖥️ Productos (Laptops) ({products.length})</h2>
        <button 
          onClick={() => navigate('/products/new')}
          style={{
            padding: '8px 15px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ➕ Nuevo Producto
        </button>
      </div>
      
      {products.length === 0 ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          border: '2px dashed #ddd', 
          borderRadius: '8px' 
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>No hay productos todavía.</p>
          <p>¡Crea el primero haciendo clic en "Nuevo Producto"!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
            <div key={product.id} style={{ 
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              background: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px' }}>
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    style={{
                      width: '100px',
                      height: '80px',
                      borderRadius: '5px',
                      objectFit: 'cover',
                      border: '1px solid #eee'
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{product.name}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    {product.brand} {product.model}
                  </p>
                  <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '12px' }}>
                    ID: {product.id.substring(0, 8)}...
                  </p>
                </div>
              </div>
              
              {/* Especificaciones resumidas */}
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ fontSize: '14px', color: '#333' }}>⚙️ Especificaciones:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: '#555' }}>
                  {product.specs?.gpu && <li><strong>GPU:</strong> {product.specs.gpu}</li>}
                  {product.specs?.cpu && <li><strong>CPU:</strong> {product.specs.cpu}</li>}
                  {product.specs?.ram && <li><strong>RAM:</strong> {product.specs.ram}</li>}
                  {product.specs?.storage && <li><strong>Almacenamiento:</strong> {product.specs.storage}</li>}
                </ul>
              </div>
              
              {/* Enlaces de afiliado */}
              <div style={{ marginBottom: '20px' }}>
                <strong style={{ fontSize: '14px', color: '#333' }}>🔗 Enlaces de Afiliado:</strong>
                <div style={{ marginTop: '8px' }}>
                  {product.affiliate_links && product.affiliate_links.length > 0 ? (
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {product.affiliate_links.map(link => (
                        <span 
                          key={link.id}
                          style={{
                            padding: '3px 8px',
                            background: link.is_active ? '#e3f2fd' : '#ffebee',
                            color: link.is_active ? '#1565c0' : '#c62828',
                            borderRadius: '12px',
                            fontSize: '11px',
                            border: link.is_active ? '1px solid #bbdefb' : '1px solid #ffcdd2'
                          }}
                          title={`${link.store}: ${link.url}`}
                        >
                          {link.store}
                          {!link.is_active && ' (inactivo)'}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '13px', color: '#f44336' }}>⚠️ Sin enlaces de afiliado</span>
                  )}
                </div>
              </div>
              
              {/* Botones de acción */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => navigate(`/products/edit/${product.id}`)}
                  style={{
                    padding: '8px 12px',
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => navigate(`/products/${product.id}/links`)}
                  style={{
                    padding: '8px 12px',
                    background: '#9c27b0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  🔗 Enlaces
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  style={{
                    padding: '8px 12px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    width: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Eliminar producto"
                >
                  🗑️
                </button>
              </div>
              
              {/* Fecha de creación */}
              <div style={{ 
                marginTop: '15px', 
                paddingTop: '15px', 
                borderTop: '1px solid #eee',
                fontSize: '11px', 
                color: '#888',
                textAlign: 'right'
              }}>
                Creado: {new Date(product.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Información del pie */}
      <div style={{ 
        marginTop: '40px', 
        padding: '15px', 
        background: '#f8f9fa', 
        borderRadius: '5px',
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>💡 Notas:</strong>
        <ul style={{ margin: '10px 0 0 20px', padding: 0 }}>
          <li>Cada producto (laptop) puede tener múltiples enlaces de afiliado (Amazon, Walmart, BestBuy, etc.)</li>
          <li>Los productos se pueden vincular con artículos para aparecer automáticamente en ellos</li>
          <li>Haz clic en "Enlaces" para gestionar los enlaces de afiliado de cada producto</li>
        </ul>
      </div>
    </div>
  );
}

export default ProductList;