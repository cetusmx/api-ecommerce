const React = require("react");

const SurtidoEmailItem = ({ item }) => {
  const styles = {
    mainTr: { backgroundColor: "#ffffff" },
    stockTr: { backgroundColor: "#fcfcfc" },
    td: {
      padding: "12px 5px",
      verticalAlign: "top",
      fontSize: "13px",
      borderBottom: "1px solid #eee"
    },
    description: { margin: 0, fontWeight: "bold", color: "#333" },
    clave: { margin: 0, fontSize: "11px", color: "#777" },
    dataExtra: { margin: 0, fontSize: "11px", color: "#555" },
    quantity: {
      fontWeight: "bold",
      textAlign: "center",
      color: "#d9534e",
      fontSize: "15px"
    },
    cost: {
      textAlign: "right",
      fontWeight: "bold",
      color: "#2e7d32"
    },
    stockBadge: {
      display: "inline-block",
      padding: "2px 6px",
      marginRight: "8px",
      backgroundColor: "#e9ecef",
      borderRadius: "4px",
      fontSize: "11px",
      color: "#444",
      border: "1px solid #dee2e6"
    }
  };
  /* const styles = {
    tr: {
      borderBottom: "1px solid #eee",
    },
    td: {
      padding: "10px 0",
      verticalAlign: "middle",
      fontSize: "14px",
    },
    clave: {
      fontSize: "12px",
      color: "#666",
    },
    description: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#333",
    },
    quantity: {
      fontSize: "14px",
      fontWeight: "bold",
      textAlign: "center",
      color: "#d9534e", // Rojo para resaltar la cantidad
    },
  }; */

  // Formatear fecha si existe
  const fechaCompra = item.FCH_ULTCOM
    ? new Date(item.FCH_ULTCOM).toLocaleDateString('es-MX')
    : 'N/A';

  return (
    <React.Fragment>
      {/* FILA 1: DATOS PRINCIPALES Y COSTOS */}
      <tr style={styles.mainTr}>
        <td style={styles.td}>
          <p style={styles.description}>{item.descripcion}</p>
          <p style={styles.clave}>CLAVE: {item.clave}</p>
        </td>
        <td style={{ ...styles.td, ...styles.quantity }}>
          {item.cantidad}
        </td>
        <td style={styles.td}>
          <p style={styles.dataExtra}><strong>Fecha:</strong> {fechaCompra}</p>
          <p style={styles.dataExtra}><strong>Prov:</strong> {item.ULTIMO_PROVEEDOR || 'N/A'}</p>
        </td>
        <td style={{ ...styles.td, ...styles.cost }}>
          ${item.ULT_COSTO ? Number(item.ULT_COSTO).toFixed(2) : '0.00'}
        </td>
      </tr>

      {/* FILA 2: DESGLOSE DE EXISTENCIAS */}
      <tr style={styles.stockTr}>
        <td colSpan="4" style={{ ...styles.td, padding: "8px 10px", backgroundColor: "#f8f9fa" }}>
          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#666", marginRight: "10px" }}>
            EXISTENCIAS:
          </span>
          {item.existencias ? Object.entries(item.existencias).map(([sucursal, cant]) => (
            <span key={sucursal} style={styles.stockBadge}>
              <strong>{sucursal}:</strong> {cant}
            </span>
          )) : <span style={{ fontSize: "11px", color: "#999" }}>No hay datos de inventario disponibles</span>}
        </td>
      </tr>
    </React.Fragment>
  );
};
/*  <tr style={styles.tr}>
   
   <td style={styles.td}>
     <p style={styles.description}>{item.descripcion}</p>
     <p style={styles.clave}>Clave: {item.clave}</p>
   </td>
  
   <td style={{ ...styles.td, ...styles.quantity }}>
     {item.cantidad} PIEZA(S)
   </td>
   <td style={{ ...styles.td, ...styles.quantity }}>
     {item.existencia} PIEZA(S)
   </td>
 </tr> */

module.exports = SurtidoEmailItem;