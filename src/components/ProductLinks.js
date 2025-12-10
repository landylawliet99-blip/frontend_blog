import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';

function ProductLinks() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  
  const [newLink, setNewLink] = useState({
    store: 'amazon',
    url: '',
    base_price: '',
    is_active: true
  });
  
  const storeOptions = [
    { value: 'amazon', label: 'Amazon 🛒', color: '#FF9900' },
    { value: 'walmart', label: 'Walmart 🏪', color: '#0071ce' },
    { value: 'bestbuy', label: 'Best Buy 🔵', color: '#0046be' },
    { value: 'newegg', label: 'Newegg 🥚', color: '#cc0000' },
    { value: 'adorama', label: 'Adorama 📸', color: '#2a5caa' },
    { value: 'bhphoto', label: 'B&H Photo 🎥', color: '#f37021' },
    { value: 'microcenter', label: 'Micro Center 💻', color: '#d2232a' }
  ];

  // Configurar axios con token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Usar useCallback para memoizar la función
  const fetchProductWithLinks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (err) {
      console.error('Error:', err);
      
      if (err.response?.status === 401) {
        setError('Sesión expirada');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 404) {
        setError('Producto no encontrado');
        setTimeout(() => navigate('/products'), 2000);
      } else {
        setError('Error al cargar: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]); // Dependencias

  useEffect(() => {
    if (id) {
      fetchProductWithLinks();
    }
  }, [id, fetchProductWithLinks]); // Incluir fetchProductWithLinks en dependencias

  const handleAddLink = async (e) => {
    e.preventDefault();
    
    if (!newLink.url) {
      alert('La URL es obligatoria');
      return;
    }

    try {
      setAddingLink(true);
      
      await axios.post(`${API_BASE_URL}/products/${id}/links`, {
        store: newLink.store,
        url: newLink.url,
        base_price: newLink.base_price ? parseFloat(newLink.base_price) : null
      });

      alert('✅ Enlace agregado');
      
      setNewLink({
        store: 'amazon',
        url: '',
        base_price: '',
        is_active: true
      });
      
      fetchProductWithLinks();
      
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setAddingLink(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('¿Eliminar este enlace?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}/links/${linkId}`);
      alert('✅ Enlace eliminado');
      fetchProductWithLinks();
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleActive = async (linkId, currentStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/products/${id}/links/${linkId}`, {
        is_active: !currentStatus
      });
      
      alert(`✅ Enlace ${!currentStatus ? 'activado' : 'desactivado'}`);
      fetchProductWithLinks();
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error al actualizar');
    }
  };

  const getStoreConfig = (storeKey) => {
    const store = storeOptions.find(s => s.value === storeKey);
    return store || { value: storeKey, label: storeKey, color: '#6c757d' };
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
  if (!product) return <div>Producto no encontrado</div>;

  const affiliateLinks = product.affiliate_links || [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/products')}
          style={{
            padding: '8px 15px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Volver
        </button>
        
        <h2>🔗 Enlaces para: {product.name}</h2>
        <p style={{ color: '#666' }}>
          ID: {product.id.substring(0, 8)}... | Marca: {product.brand || '-'} | Modelo: {product.model || '-'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <h3>Enlaces ({affiliateLinks.length})</h3>
          
          {affiliateLinks.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', border: '2px dashed #ddd', borderRadius: '8px' }}>
              <p style={{ color: '#666' }}>No hay enlaces</p>
              <p>¡Agrega el primero!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {affiliateLinks.map((link) => {
                const store = getStoreConfig(link.store);
                
                return (
                  <div key={link.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ padding: '5px 10px', background: store.color, color: 'white', borderRadius: '4px' }}>
                          {store.label}
                        </span>
                        
                        <button
                          onClick={() => handleToggleActive(link.id, link.is_active)}
                          style={{
                            padding: '3px 8px',
                            background: link.is_active ? '#4caf50' : '#ff9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          {link.is_active ? '✅ Activo' : '⏸️ Inactivo'}
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        style={{
                          padding: '5px 10px',
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                    
                    <div style={{ marginTop: '10px' }}>
                      <p style={{ margin: '5px 0' }}>
                        <strong>URL:</strong>{' '}
                        <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2196f3' }}>
                          {link.url.length > 50 ? link.url.substring(0, 50) + '...' : link.url}
                        </a>
                      </p>
                      
                      <p style={{ margin: '5px 0' }}>
                        <strong>Precio Base:</strong>{' '}
                        {link.base_price ? `$${link.base_price.toFixed(2)}` : '-'}
                      </p>
                      
                      {link.current_price && (
                        <p style={{ margin: '5px 0' }}>
                          <strong>Precio Actual:</strong>{' '}
                          <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                            ${link.current_price.toFixed(2)}
                          </span>
                          {link.discount_percentage && (
                            <span style={{ 
                              marginLeft: '8px',
                              background: '#ff9800',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              fontSize: '12px'
                            }}>
                              -{link.discount_percentage}%
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3>➕ Agregar Enlace</h3>
          
          <form onSubmit={handleAddLink} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label>Tienda *</label>
              <select
                value={newLink.store}
                onChange={(e) => setNewLink({...newLink, store: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                disabled={addingLink}
              >
                {storeOptions.map((store) => (
                  <option key={store.value} value={store.value}>
                    {store.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label>URL de Afiliado *</label>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                placeholder="https://www.amazon.com/dp/B0CXXXXXXX?tag=TU_TAG"
                required
                disabled={addingLink}
              />
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label>Precio Base (USD)</label>
              <input
                type="number"
                step="0.01"
                value={newLink.base_price}
                onChange={(e) => setNewLink({...newLink, base_price: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                placeholder="999.99"
                disabled={addingLink}
              />
            </div>
            
            <button
              type="submit"
              disabled={addingLink}
              style={{ 
                padding: '10px 20px', 
                background: addingLink ? '#ccc' : '#4caf50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: addingLink ? 'not-allowed' : 'pointer'
              }}
            >
              {addingLink ? '⏳ Agregando...' : '➕ Agregar Enlace'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductLinks;