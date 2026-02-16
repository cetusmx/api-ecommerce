const React = require('react');

const PedidoEmailItem = ({ item }) => {
  // Asumimos que el backend proveerá la URL completa de la imagen
  const imageUrl = item.imageUrl || `https://www.sealmarket.net/Perfiles/${item.perfil}.png`; // Fallback por si acaso

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') {
        return 'Fecha no disponible';
    }
    
    // 🚨 CORRECCIÓN CLAVE: Dividir la cadena YYYY-MM-DD para crear la fecha
    // en la hora local y EVITAR el desfase de zona horaria (UTC).
    const parts = dateString.split('-'); 
    const year = parseInt(parts[0], 10);
    // El mes es base 0 en JavaScript, por eso restamos 1 (Septiembre = 8).
    const monthIndex = parseInt(parts[1], 10) - 1; 
    const day = parseInt(parts[2], 10);
    
    // Esto crea la fecha como 2025-09-30T00:00:00 en la zona horaria local.
    const date = new Date(year, monthIndex, day); 

    // Opciones para el formato: "miércoles, 1 de octubre"
    const options = { 
        weekday: 'long', // Nombre completo del día
        day: 'numeric',  // Número del día del mes
        month: 'long',   // Nombre completo del mes
    };
    
    // toLocaleDateString generará la cadena (ej. "martes, 30 de septiembre")
    let formattedDate = date.toLocaleDateString('es-ES', options);
    
    // Capitalizar la primera letra del día
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    // Nota: Dejamos que la función toLocaleDateString maneje la preposición "de".
    // Si tu versión anterior tenía una manipulación de cadena para quitar ' de ', 
    // quítala para que el formato final sea "Miércoles, 1 de octubre".

    return formattedDate;
};

  const styles = {
    tr: {
      borderBottom: '1px solid #ddd',
    },
    td: {
      padding: '15px 10px',
      verticalAlign: 'middle',
    },
    img: {
      display: 'block',
      width: '40px',
      height: '40px',
      objectFit: 'cover',
    },
    productInfo: {
      display: 'flex',
      alignItems: 'center',
    },
    description: {
      fontSize: '12px',
      color: '#555',
    },
    sku: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#2177c2',
      textDecoration: 'none',
    },
    quantity: {
      fontSize: '14px',
      textAlign: 'center',
    },
    price: {
      fontSize: '14px',
      fontWeight: 'bold',
      textAlign: 'right',
    },
  };

  return (
    <tr style={styles.tr}>
      <td style={styles.td}>
        <div style={styles.productInfo}>
          <img 
          src={imageUrl} 
          alt={item.descripcion}
          width="40" 
          height="40"
          style={styles.img} />
          <div style={{ marginLeft: '15px' }}>
            <p style={styles.sku}>CLAVE: {item.clave}</p>
            <a href={`https://www.sealmarket.net/producto/${item.clave}`} style={styles.description}>
              {item.descripcion}
            </a>
            
            {item.fecha_entrega && item.fecha_entrega !== 'N/A' && (
                <p style={{...styles.sku, color: '#339966', fontWeight: 'bold'}}>
                    Entrega: {formatDate(item.fecha_entrega)}
                </p>
            )}
          </div>
        </div>
      </td>
      <td style={{ ...styles.td, ...styles.quantity }}>{item.cantidad}</td>
      <td style={{ ...styles.td, ...styles.price }}>${parseFloat(item.total_partida).toFixed(2)}</td>
    </tr>
  );
};

module.exports = PedidoEmailItem;
