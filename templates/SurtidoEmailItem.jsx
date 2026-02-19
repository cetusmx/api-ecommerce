// /SurtidoEmail/SurtidoEmailItem.jsx
const React = require("react");

const SurtidoEmailItem = ({ item }) => {
  const styles = {
    mainTr: { backgroundColor: "#ffffff" },
    td: {
      padding: "12px 5px",
      verticalAlign: "top",
      fontSize: "13px",
      borderBottom: "1px solid #eeeeee"
    },
    description: { margin: "0", fontWeight: "bold", color: "#333333" },
    clave: { margin: "0", fontSize: "11px", color: "#777777" },
    dataExtra: { margin: "0", fontSize: "11px", color: "#555555" },
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
    // Estilos para la "falsa" etiqueta (badge) usando celdas de tabla
    badgeTd: {
      backgroundColor: "#e9ecef",
      border: "1px solid #dee2e6",
      padding: "2px 8px",
      fontSize: "11px",
      color: "#444444",
      fontFamily: "Arial, sans-serif"
    }
  };

  const fechaCompra = item.FCH_ULTCOM 
    ? new Date(item.FCH_ULTCOM).toLocaleDateString('es-MX') 
    : 'N/A';

  return (
    <React.Fragment>
      {/* FILA 1: DATOS PRINCIPALES */}
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

      {/* FILA 2: EXISTENCIAS (Usando tablas anidadas para forzar el espaciado) */}
      <tr>
        <td colSpan="4" style={{ padding: "15px 10px 15px 10px", backgroundColor: "#f8f9fa", borderBottom: "2px solid #dddddd" }}>
          <table cellPadding="0" cellSpacing="0" border="0">
            <tr>
              <td style={{ fontSize: "11px", fontWeight: "bold", color: "#666666", paddingRight: "10px" }}>
                EXISTENCIAS:
              </td>
              {item.existencias && Object.entries(item.existencias).map(([sucursal, cant]) => (
                <React.Fragment key={sucursal}>
                  {/* Celda que actúa como el "Badge" */}
                  <td style={styles.badgeTd}>
                    <strong>{sucursal}:</strong>&nbsp;{cant}
                  </td>
                  {/* Celda de espacio artificial (Sustituye al margin) */}
                  <td width="10">&nbsp;</td> 
                </React.Fragment>
              ))}
              {!item.existencias && (
                <td style={{ fontSize: "11px", color: "#999999" }}>No hay datos disponibles</td>
              )}
            </tr>
          </table>
        </td>
      </tr>
    </React.Fragment>
  );
};

module.exports = SurtidoEmailItem;