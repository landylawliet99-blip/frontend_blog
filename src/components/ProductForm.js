import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    image_url: '',
    specs: {
      gpu: '',
      cpu: '',
      ram: '',
      storage: '',
      display: '',
      os: '',
      battery_life: '',
      weight: '',
      ports: '',
      wifi: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Configurar axios para enviar el token en todas las peticiones
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const fetchProduct = async (productId) => {
    try {
      setFetching(true);
      // USANDO LA NUEVA RUTA: /api/products/:id
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      
      if (response.data.success) {
        const product = response.data.data;
        setFormData({
          name: product.name || '',
          brand: product.brand || '',
          model: product.model || '',
          image_url: product.image_url || '',
          specs: {
            gpu: product.specs?.gpu || '',
            cpu: product.specs?.cpu || '',
            ram: product.specs?.ram || '',
            storage: product.specs?.storage || '',
            display: product.specs?.display || '',
            os: product.specs?.os || '',
            battery_life: product.specs?.battery_life || '',
            weight: product.specs?.weight || '',
            ports: product.specs?.ports || '',
            wifi: product.specs?.wifi || ''
          }
        });
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      
      if (err.response?.status === 401) {
        setError('Sesión expirada. Inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 404) {
        setError('Producto no encontrado');
        setTimeout(() => navigate('/products'), 2000);
      } else {
        setError('Error al cargar el producto: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchProduct(id);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('specs.')) {
      const specField = name.split('.')[1];
      setFormData({
        ...formData,
        specs: {
          ...formData.specs,
          [specField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name) {
      setError('El nombre del producto es obligatorio');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      if (isEditing) {
        // USANDO LA NUEVA RUTA: PUT /api/products/:id
        await axios.put(`${API_BASE_URL}/products/${id}`, formData, config);
        alert('✅ Producto actualizado');
      } else {
        // RUTA EXISTENTE: POST /api/products
        await axios.post(`${API_BASE_URL}/products`, formData, config);
        alert('✅ Producto creado');
      }
      
      navigate('/products');
      
    } catch (err) {
      console.error('Error:', err);
      
      if (err.response?.status === 401) {
        setError('Sesión expirada. Inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || 'Error al guardar');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching && isEditing) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando producto...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>{isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h2>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          background: '#ffebee', 
          color: '#c62828', 
          borderRadius: '5px', 
          marginBottom: '20px',
          border: '1px solid #ef9a9a'
        }}>
          ❌ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Nombre del Producto *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            placeholder="Lenovo LOQ 16 pulgadas con RTX 5060"
            required
            disabled={loading}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Marca
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              placeholder="Lenovo"
              disabled={loading}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Modelo
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              placeholder="LOQ 16IRX9"
              disabled={loading}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            URL de la Imagen
          </label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            placeholder="https://images.unsplash.com/photo-..."
            disabled={loading}
          />
          {formData.image_url && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={formData.image_url} 
                alt="Vista previa" 
                style={{ 
                  maxWidth: '150px', 
                  maxHeight: '100px', 
                  border: '1px solid #ddd', 
                  borderRadius: '5px',
                  objectFit: 'cover' 
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span style="color: #f44336;">❌ Error al cargar la imagen</span>';
                }}
              />
            </div>
          )}
        </div>
        
        {/* Especificaciones */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px', background: '#f9f9f9' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>⚙️ Especificaciones</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>GPU:</label>
              <input
                type="text"
                name="specs.gpu"
                value={formData.specs.gpu}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="NVIDIA RTX 5060 8GB"
                disabled={loading}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>CPU:</label>
              <input
                type="text"
                name="specs.cpu"
                value={formData.specs.cpu}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="Intel Core i7-13650HX"
                disabled={loading}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>RAM:</label>
              <input
                type="text"
                name="specs.ram"
                value={formData.specs.ram}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="16GB DDR5"
                disabled={loading}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Almacenamiento:</label>
              <input
                type="text"
                name="specs.storage"
                value={formData.specs.storage}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="512GB SSD"
                disabled={loading}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Pantalla:</label>
              <input
                type="text"
                name="specs.display"
                value={formData.specs.display}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="16 pulgadas 1920x1200 144Hz"
                disabled={loading}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Sistema Operativo:</label>
              <input
                type="text"
                name="specs.os"
                value={formData.specs.os}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="Windows 11 Home"
                disabled={loading}
              />
            </div>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Duración Batería:</label>
            <input
              type="text"
              name="specs.battery_life"
              value={formData.specs.battery_life}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="4-6 horas"
              disabled={loading}
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Peso:</label>
            <input
              type="text"
              name="specs.weight"
              value={formData.specs.weight}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="2.3 kg"
              disabled={loading}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/products')}
            style={{ 
              padding: '10px 20px', 
              background: '#f5f5f5', 
              color: '#333', 
              border: '1px solid #ddd', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              background: loading ? '#ccc' : '#4caf50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              minWidth: '120px'
            }}
          >
            {loading ? (
              <span>⏳ Guardando...</span>
            ) : isEditing ? (
              '💾 Actualizar'
            ) : (
              '➕ Crear Producto'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;