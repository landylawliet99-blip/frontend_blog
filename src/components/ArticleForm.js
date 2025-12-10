import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';

function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    status: 'draft'
  });
  
  const [allProducts, setAllProducts] = useState([]); // Todos los productos disponibles
  const [selectedProducts, setSelectedProducts] = useState([]); // Productos seleccionados
  const [productNotes, setProductNotes] = useState({}); // Notas por producto
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Cargar productos disponibles
  useEffect(() => {
    fetchProducts();
  }, []);

  // Cargar artículo si estamos editando
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchArticle(id);
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAllProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Obtener el artículo si estamos editando
  const fetchArticle = async (articleId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/articles/${articleId}`);
      if (response.data.success) {
        const article = response.data.data;
        setFormData(article);
        
        // Cargar productos vinculados a este artículo
        if (article.article_products && article.article_products.length > 0) {
          const currentProducts = article.article_products.map(ap => ap.products.id);
          const currentNotes = {};
          
          article.article_products.forEach(ap => {
            currentNotes[ap.products.id] = ap.review_notes || '';
          });
          
          setSelectedProducts(currentProducts);
          setProductNotes(currentNotes);
        }
      }
    } catch (err) {
      setError('Error al cargar el artículo: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Generar slug automáticamente desde el título
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .substring(0, 40);
  };

  // Cuando cambia el título, generar el slug automáticamente
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title: title,
      slug: generateSlug(title)
    });
  };

  // Manejar selección de productos
  const handleProductSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      // Deseleccionar producto
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
      
      // Eliminar sus notas
      const newNotes = { ...productNotes };
      delete newNotes[productId];
      setProductNotes(newNotes);
    } else {
      // Seleccionar producto
      setSelectedProducts([...selectedProducts, productId]);
      // Inicializar notas vacías para este producto
      setProductNotes({
        ...productNotes,
        [productId]: ''
      });
    }
  };

  // Manejar cambio en notas de producto
  const handleProductNoteChange = (productId, note) => {
    setProductNotes({
      ...productNotes,
      [productId]: note
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones básicas
    if (!formData.title || !formData.slug || !formData.content) {
      setError('Por favor, completa los campos obligatorios: Título, Slug y Contenido');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Paso 1: Guardar el artículo
      let articleId = id;
      
      if (isEditing) {
        // Actualizar artículo existente
        const response = await axios.put(`${API_BASE_URL}/articles/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        articleId = response.data.data.id;
        alert('✅ Artículo actualizado correctamente');
      } else {
        // Crear nuevo artículo
        const response = await axios.post(`${API_BASE_URL}/articles`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        articleId = response.data.data.id;
        alert('✅ Artículo creado correctamente');
      }
      
      // Paso 2: Vincular productos seleccionados
      if (selectedProducts.length > 0) {
        const linkPromises = selectedProducts.map(productId => {
          return axios.post(
            `${API_BASE_URL}/articles/${articleId}/products`,
            {
              productId: productId,
              reviewNotes: productNotes[productId] || ''
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        });
        
        await Promise.all(linkPromises);
        alert(`✅ ${selectedProducts.length} producto(s) vinculado(s) al artículo`);
      }
      
      // Redirigir a la lista de artículos
      navigate('/articles');
      
    } catch (err) {
      console.error('Error al guardar el artículo:', err);
      
      if (err.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        setError('No tienes permisos para realizar esta acción');
      } else {
        setError(err.response?.data?.message || 'Error al guardar el artículo');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando artículo...</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
        {isEditing ? '✏️ Editar Artículo' : '➕ Nuevo Artículo'}
      </h2>
      
      {error && (
        <div style={{ padding: '15px', background: '#ffebee', color: '#c62828', borderRadius: '5px', marginBottom: '20px' }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Campos del artículo (igual que antes) */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Título *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
            placeholder="Ej: Las mejores laptops gaming 2025"
            required
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Slug (URL amigable) *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
            placeholder="ej: mejores-laptops-gaming-2025"
            required
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Extracto (resumen)
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', resize: 'vertical' }}
            placeholder="Breve descripción que aparecerá en la lista de artículos"
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Contenido *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="12"
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', resize: 'vertical' }}
            placeholder="Escribe aquí el contenido completo de tu artículo..."
            required
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            URL de la imagen de portada
          </label>
          <input
            type="text"
            name="cover_image_url"
            value={formData.cover_image_url}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
            placeholder="https://ejemplo.com/imagen-portada.jpg"
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Estado
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
          >
            <option value="draft">📝 Borrador</option>
            <option value="published">🚀 Publicado</option>
          </select>
        </div>
        
        {/* SECCIÓN NUEVA: Seleccionar productos */}
        <div style={{ 
          marginBottom: '40px', 
          padding: '25px', 
          border: '2px solid #e3f2fd', 
          borderRadius: '8px',
          background: '#f8fbff'
        }}>
          <h3 style={{ marginTop: 0, color: '#1976d2' }}>🖥️ Productos para Vincular</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Selecciona los productos (laptops) que mencionarás en este artículo. 
            Aparecerán automáticamente en la vista pública con sus enlaces de afiliado.
          </p>
          
          {loadingProducts ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              Cargando productos disponibles...
            </div>
          ) : allProducts.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #ddd', borderRadius: '5px' }}>
              <p>No hay productos creados todavía.</p>
              <button
                type="button"
                onClick={() => navigate('/products/new')}
                style={{ 
                  marginTop: '10px',
                  padding: '8px 15px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🖥️ Crear Primer Producto
              </button>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {allProducts.map((product) => {
                const isSelected = selectedProducts.includes(product.id);
                
                return (
                  <div 
                    key={product.id}
                    style={{ 
                      marginBottom: '15px',
                      padding: '15px',
                      border: `2px solid ${isSelected ? '#4caf50' : '#eee'}`,
                      borderRadius: '8px',
                      background: isSelected ? '#f1f8e9' : '#fff',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleProductSelect(product.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleProductSelect(product.id)}
                        style={{ marginRight: '15px', transform: 'scale(1.3)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          {product.name}
                          {isSelected && <span style={{ marginLeft: '10px', color: '#4caf50' }}>✓ Seleccionado</span>}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {product.brand} {product.model} • {product.specs?.gpu}
                        </div>
                      </div>
                    </div>
                    
                    {/* Campo para notas específicas de este producto */}
                    {isSelected && (
                      <div style={{ marginTop: '15px', paddingLeft: '35px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                          📝 Comentario específico para este producto en el artículo:
                        </label>
                        <textarea
                          value={productNotes[product.id] || ''}
                          onChange={(e) => handleProductNoteChange(product.id, e.target.value)}
                          rows="2"
                          style={{ 
                            width: '100%', 
                            padding: '10px', 
                            border: '1px solid #ddd', 
                            borderRadius: '5px',
                            fontSize: '14px',
                            resize: 'vertical'
                          }}
                          placeholder="Ej: 'La mejor relación calidad-precio' o 'Perfecta para gaming en 1080p'"
                          onClick={(e) => e.stopPropagation()} // Evita que el click seleccione/deseleccione
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {selectedProducts.length > 0 && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#e8f5e9', 
              borderRadius: '5px',
              border: '1px solid #c8e6c9'
            }}>
              <strong>✅ {selectedProducts.length} producto(s) seleccionado(s):</strong>
              <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProducts.map(productId => {
                  const product = allProducts.find(p => p.id === productId);
                  return product ? (
                    <span 
                      key={productId}
                      style={{
                        padding: '5px 10px',
                        background: '#4caf50',
                        color: 'white',
                        borderRadius: '15px',
                        fontSize: '13px'
                      }}
                    >
                      {product.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/articles')}
            style={{
              padding: '12px 25px',
              background: '#f5f5f5',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 25px',
              background: loading ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              minWidth: '200px'
            }}
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Artículo' : 'Crear Artículo y Vincular Productos')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArticleForm;