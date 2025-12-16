// eslint-disable-next-line no-unused-vars
const handleImport = async () => {
  // ... código existente ...
  
  try {
    // COMENTA ESTO temporalmente:
    // const response = await axios.post(`${API_BASE_URL}/scrape/product`, {
    //   url: importUrl
    // });
    
    // EN SU LUGAR, USA DATOS DE PRUEBA:
    const mockProduct = {
      name: "ASUS ROG Zephyrus G14 Gaming Laptop",
      brand: "ASUS",
      model: "GA402XV-G14.R94060",
      image_url: "https://m.media-amazon.com/images/I/81Yq...",
      specs: {
        gpu: "NVIDIA GeForce RTX 4060 8GB",
        cpu: "AMD Ryzen 9 7940HS",
        ram: "16GB DDR5",
        storage: "1TB SSD",
        display: "14-inch QHD+ 165Hz",
      },
      affiliate_url: "https://www.amazon.com/dp/B0XXXX?tag=laptopsgaming-20"
    };
    
    // Actualizar el formulario con los datos MOCK
    // eslint-disable-next-line no-undef
    setFormData({
      name: mockProduct.name,
      brand: mockProduct.brand,
      // ... etc, siguiendo la misma lógica que ya está en el handleImport original
    });
    
    alert('✅ Producto importado (datos de prueba)');
    
  } catch (err) {
    // ... manejo de errores ...
  }
};