const React = require('react');

const PedidoEmailItem = ({ item }) => {
  // Fallback para la imagen del producto
  //const imageUrl = item.imageUrl || `https://www.sealmarket.net/Perfiles/${item.perfil}.png`;

  // Determine the correct image URL based on category
  const perfilesUrl = `https://www.sealmarket.net/Perfiles/${item.perfil}.png`;
  const sugeridosUrl = `https://www.sealmarket.net/Sugeridos/${item.clave}.jpg`;
  const imageUrl = (item.categoria === 'Herramientas' || item.categoria === 'Accesorios' || item.categoria === 'Estuches' || item.categoria === 'Accesorios hidráulicos')
    ? sugeridosUrl
    : perfilesUrl;

    console.log("imageUrl: ",imageUrl);

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'Fecha no disponible';
    
    const parts = dateString.split('-'); 
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1; 
    const day = parseInt(parts[2], 10);
    const date = new Date(year, monthIndex, day); 

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    let formattedDate = date.toLocaleDateString('es-ES', options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const styles = {
    tr: {
      borderBottom: '1px solid #eeeeee',
    },
    td: {
      padding: '12px 5px',
      verticalAlign: 'top',
      fontSize: '13px',
    },
    // Estilos replicados de SurtidoEmailItem
    description: { 
        margin: "0", 
        fontWeight: "bold", 
        color: "#333333",
        fontSize: "13px",
        textDecoration: "none",
        display: "block"
    },
    clave: { 
        margin: "2px 0 0 0", 
        fontSize: "11px", 
        color: "#777777",
        textTransform: "uppercase"
    },
    deliveryDate: {
        margin: "4px 0 0 0",
        fontSize: "11px",
        color: "#339966",
        fontWeight: "bold"
    },
    quantity: {
      fontSize: "14px",
      fontWeight: "bold",
      textAlign: "center",
      color: "#333333"
    },
    price: {
      fontSize: "14px",
      fontWeight: "bold",
      textAlign: "right",
      color: "#2177c2"
    }
  };

  return (
    <tr style={styles.tr}>
      {/* Columna 1: Imagen + (Descripción y Clave) */}
      <td style={styles.td}>
        <table cellPadding="0" cellSpacing="0" border="0" style={{ width: "100%" }}>
          <tr>
            {/* Imagen al principio (lado izquierdo) */}
            <td style={{ width: "50px", verticalAlign: "top", paddingRight: "10px" }}>
              <img 
                src={imageUrl} 
                alt={item.descripcion}
                width="45" 
                height="45"
                style={{ display: "block", borderRadius: "4px", border: "1px solid #eeeeee" }} 
              />
            </td>
            {/* Texto: Descripción arriba, Clave abajo (Formato Surtido) */}
            <td style={{ verticalAlign: "top" }}>
              <a href={`https://www.sealmarket.net/producto/${item.clave}`} style={styles.description}>
                {item.descripcion}
              </a>
              <p style={styles.clave}>CLAVE: {item.clave}</p>
              
              {/* {item.fecha_entrega && item.fecha_entrega !== 'N/A' && (
                <p style={styles.deliveryDate}>
                  Entrega: {formatDate(item.fecha_entrega)}
                </p>
              )} */}
            </td>
          </tr>
        </table>
      </td>

      {/* Columna 2: Cantidad */}
      <td style={{ ...styles.td, ...styles.quantity }}>
        {item.cantidad}
      </td>

      {/* Columna 3: Total Partida */}
      <td style={{ ...styles.td, ...styles.price }}>
        ${parseFloat(item.total_partida).toFixed(2)}
      </td>
    </tr>
  );
};

module.exports = PedidoEmailItem;