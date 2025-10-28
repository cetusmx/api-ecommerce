// /SurtidoEmail/SurtidoEmailItem.jsx

const React = require("react");

const SurtidoEmailItem = ({ item }) => {
  const styles = {
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
  };

  return (
    <tr style={styles.tr}>
      {/* Columna 1: Clave y Descripción */}
      <td style={styles.td}>
        <p style={styles.description}>{item.descripcion}</p>
        <p style={styles.clave}>Clave: {item.clave}</p>
      </td>
      {/* Columna 2: Cantidad */}
      <td style={{ ...styles.td, ...styles.quantity }}>
        {item.cantidad} UNIDAD(ES)
      </td>
    </tr>
  );
};

module.exports = SurtidoEmailItem;