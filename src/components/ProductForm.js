// frontend_blog/src/components/ProductForm.js - VERSIÓN COMPLETA Y FUNCIONAL
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estado principal del formulario
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
  
  // Estado para la funcionalidad de IMPORTACIÓN
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const [showMockOption, setShowMockOption] = useState(false);
  
  // Estados generales
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Configurar axios con token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Función para IMPORTAR PRODUCTO desde URL
  const handleImport = async () => {
    if (!importUrl.trim()) {
      setImportMessage('❌ Por favor, introduce una URL válida');
      return;
    }

    setImporting(true);
    setImportMessage('🔍 Conectando con el servidor...');
    
    try {
      console.log('Intentando importar desde:', importUrl);
      
      // Llamar al backend de scraping
      const response = await axios.post(`${API_BASE_URL}/scrape/product`, {
        url: importUrl
      }, {
        timeout: 30000 // 30 segundos de timeout
      });

      if (response.data.success) {
        const productData = response.data.data;
        
        // Mapear datos del scraping a nuestro formulario
        const updatedFormData = {
          name: productData.name || '',
          brand: productData.brand || '',
          model: productData.model || '',
          image_url: productData.image_url || '',
          specs: {
            gpu: productData.specs?.gpu || '',
            cpu: productData.specs?.cpu || '',
            ram: productData.specs?.ram || '',
            storage: productData.specs?.storage || '',
            display: productData.specs?.display || '',
            os: productData.specs?.os || '',
            battery_life: productData.specs?.battery_life || '',
            weight: productData.specs?.weight || '',
            ports: productData.specs?.ports || '',
            wifi: productData.specs?.wifi || ''
          }
        };

        setFormData(updatedFormData);

        // Si hay URL de afiliado, la mostramos como sugerencia
        if (productData.affiliate_url) {
          setImportMessage(`✅ Producto importado exitosamente. URL de afiliado disponible: ${productData.affiliate_url.substring(0, 80)}...`);
        } else {
          setImportMessage('✅ Producto importado exitosamente. Completa los campos faltantes.');
        }
        
        // Limpiar la URL después de importar
        setImportUrl('');
        setShowMockOption(false);
        
      } else {
        setImportMessage(`❌ Error: ${response.data.message || 'No se pudo importar el producto'}`);
        setShowMockOption(true);
      }
    } catch (err) {
      console.error('Error en importación:', err);
      
      // Mostrar mensaje de error específico
      let errorMsg = '';
      if (err.response?.data?.message) {
        errorMsg = `❌ ${err.response.data.message}`;
      } else if (err.message.includes('Network Error')) {
        errorMsg = '❌ Error de red. Verifica tu conexión o que el servidor esté corriendo.';
      } else if (err.message.includes('timeout')) {
        errorMsg = '❌ Tiempo de espera agotado. La tienda no respondió.';
      } else if (err.code === 'ECONNABORTED') {
        errorMsg = '❌ La conexión tardó demasiado. Posible bloqueo geográfico.';
      } else {
        errorMsg = `❌ Error: ${err.message || 'Error desconocido'}`;
      }
      
      setImportMessage(errorMsg);
      setShowMockOption(true);
    } finally {
      setImporting(false);
    }
  };

  // Función para cargar datos MOCK (para desarrollo cuando scraping falla)
  const loadMockData = () => {
    const mockProduct = {
      name: 'ASUS ROG Zephyrus G14 Gaming Laptop',
      brand: 'ASUS',
      model: 'GA402XV-G14.R94060',
      image_url: 'https://m.media-amazon.com/images/I/81Yq6L2Yf6L._AC_SL1500_.jpg',
      specs: {
        gpu: 'NVIDIA GeForce RTX 4060 8GB GDDR6',
        cpu: 'AMD Ryzen 9 7940HS (8-core, 16-thread)',
        ram: '16GB DDR5',
        storage: '1TB PCIe 4.0 SSD',
        display: '14-inch QHD+ (2560x1600) 165Hz',
        os: 'Windows 11 Pro',
        battery_life: '8-10 horas',
        weight: '3.64 lbs (1.65 kg)',
        ports: 'USB-C, USB-A, HDMI 2.1, 3.5mm audio',
        wifi: 'Wi-Fi 6E'
      }
    };

    setFormData({
      name: mockProduct.name,
      brand: mockProduct.brand,
      model: mockProduct.model,
      image_url: mockProduct.image_url,
      specs: mockProduct.specs
    });

    setImportMessage('✅ Datos de prueba cargados. Puedes editarlos antes de guardar.');
    setShowMockOption(false);
    setImportUrl('');
  };

  // Cargar producto si estamos editando - con useCallback para evitar warnings
  const fetchProduct = useCallback(async (productId) => {
    try {
      setFetching(true);
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
  }, [navigate]);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  // Manejar cambios en los campos del formulario
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

  // Enviar formulario (crear o actualizar producto)
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
        await axios.put(`${API_BASE_URL}/products/${id}`, formData, config);
        alert('✅ Producto actualizado');
      } else {
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
      
      {/* SECCIÓN DE IMPORTACIÓN AUTOMÁTICA */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        border: '2px solid #e3f2fd', 
        borderRadius: '8px',
        background: '#f8fbff'
      }}>
        <h3 style={{ marginTop: 0, color: '#1976d2' }}>🚀 Importar automáticamente desde URL</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Pega la URL de un producto de Amazon, Walmart, BestBuy o Newegg para importar automáticamente todos sus datos.
          <br />
          <small><em>Nota: Desde algunas ubicaciones puede haber bloqueos. En producción funcionará.</em></small>
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder="https://www.amazon.com/dp/B0XXXXXX... o https://www.walmart.com/ip/..."
            style={{ 
              flex: 1, 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              fontSize: '14px'
            }}
            disabled={importing}
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={importing || !importUrl.trim()}
            style={{
              padding: '12px 20px',
              background: importing ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: importing ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              minWidth: '120px'
            }}
          >
            {importing ? '⏳ Importando...' : '🚀 Importar'}
          </button>
        </div>
        
        {importMessage && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            borderRadius: '5px',
            background: importMessage.includes('✅') ? '#e8f5e9' : '#ffebee',
            border: `1px solid ${importMessage.includes('✅') ? '#c8e6c9' : '#ffcdd2'}`,
            color: importMessage.includes('✅') ? '#2e7d32' : '#c62828',
            fontSize: '14px'
          }}>
            {importMessage}
          </div>
        )}
        
        {/* Opción para cargar datos MOCK cuando scraping falla */}
        {showMockOption && (
          <div style={{ 
            marginTop: '15px', 
            padding: '15px', 
            background: '#fff3e0', 
            borderRadius: '5px',
            border: '1px solid #ffcc80'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#ef6c00' }}>
              <strong>⚠️ ¿El scraping falla por bloqueo geográfico?</strong>
            </p>
            <button
              type="button"
              onClick={loadMockData}
              style={{
                padding: '8px 15px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🧪 Cargar datos de prueba (desarrollo)
            </button>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
              Esto cargará un ejemplo de laptop gaming para que puedas probar el formulario.
            </p>
          </div>
        )}
        
        <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
          <strong>💡 Ejemplos válidos:</strong>
          <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
            <li><code>https://www.amazon.com/dp/B0CMCRY948</code> (Amazon)</li>
            <li><code>https://www.walmart.com/ip/HP-Victus-15-FHD-Gaming-Laptop/5222378446</code> (Walmart)</li>
            <li><code>https://www.bestbuy.com/site/lenovo-legion-slim-5-16-wqxga-gaming-laptop/6549903.p</code> (BestBuy)</li>
          </ul>
        </div>
      </div>
      
      {/* FORMULARIO PRINCIPAL */}
      {error && !importMessage.includes('Error') && (
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
        
        {/* Botones de acción */}
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