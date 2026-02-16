const React = require('react');
const PedidoEmailItem = require('./PedidoEmailItem');

const PedidoEmail = ({ pedido }) => {
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const styles = {
    body: {
      fontFamily: "Arial, sans-serif",
      color: "#333",
      backgroundColor: "#f4f4f4",
      margin: 0,
      padding: "20px",
    },
    container: {
      maxWidth: "680px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      overflow: "hidden",
    },
    header: {
      backgroundColor: "#2177c2",
      color: "#ffffff",
      padding: "30px 20px",
      textAlign: "center",
    },
    headerTitle: {
      margin: 0,
      fontSize: "28px",
    },
    headerSubtitle: {
      margin: "5px 0 0",
      fontSize: "16px",
    },
    content: {
      padding: "30px",
    },
    // --- SECCIÓN ESTILIZADA DE DETALLES ---
    orderDetails: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "25px",
      backgroundColor: "#fafafa", // Fondo muy tenue para diferenciar la zona
      border: "1px solid #f0f0f0",
      borderRadius: "4px",
    },
    orderDetailTd: {
      padding: "6px 12px", // Reducido el espacio vertical (de 8px a 6px)
      fontSize: "13px",
      borderBottom: "1px solid #eeeeee", // Línea divisoria sutil
    },
    orderDetailLabel: {
      color: "#888",
      fontSize: "11px",
      textTransform: "uppercase", // Estilo moderno tipo etiqueta
      fontWeight: "bold",
      letterSpacing: "0.5px",
    },
    orderDetailValue: {
      textAlign: "right",
      color: "#444",
      fontWeight: "bold",
    },
    // --------------------------------------
    itemsTable: {
      width: "100%",
      borderCollapse: "collapse",
    },
    itemsTh: {
      borderBottom: "2px solid #ddd",
      padding: "0 10px 10px 10px",
      textAlign: "left",
      color: "#555",
      fontSize: "14px",
    },
    totalSection: {
      padding: "20px 30px",
      textAlign: "right",
      backgroundColor: "#f9f9f9",
      borderTop: "1px solid #ddd",
    },
    totalText: {
      margin: 0,
      fontSize: "18px",
      fontWeight: "bold",
    },
    footer: {
      padding: "20px",
      textAlign: "center",
      fontSize: "12px",
      color: "#888",
    },
  };

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirmación de Pedido</title>
      </head>
      <body style={styles.body}>
        <table style={styles.container} cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
              <th style={styles.header}>
                <h1 style={styles.headerTitle}>¡Hola, {pedido.enviar_a}!</h1>
                <p style={styles.headerSubtitle}>
                  Confirmación del Pedido #{pedido.folio}
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.content}>
                {/* TABLA DE DETALLES OPTIMIZADA */}
                <table style={styles.orderDetails}>
                  <tbody>
                    <tr>
                      <td style={styles.orderDetailTd}>
                        <span style={styles.orderDetailLabel}>Pedido realizado</span>
                      </td>
                      <td style={{ ...styles.orderDetailTd, ...styles.orderDetailValue }}>
                        {formatDate(pedido.createdAt)}
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.orderDetailTd}>
                        <span style={styles.orderDetailLabel}>Enviar a</span>
                      </td>
                      <td style={{ ...styles.orderDetailTd, ...styles.orderDetailValue }}>
                        {pedido.enviar_a}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.orderDetailTd, borderBottom: "none" }}>
                        <span style={styles.orderDetailLabel}>Estatus del pedido</span>
                      </td>
                      <td style={{ ...styles.orderDetailTd, ...styles.orderDetailValue, borderBottom: "none" }}>
                        {pedido.estatus}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table style={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th style={styles.itemsTh}>Producto</th>
                      <th style={{ ...styles.itemsTh, textAlign: "center" }}>
                        Cantidad
                      </th>
                      <th style={{ ...styles.itemsTh, textAlign: "right" }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.items.map((item) => (
                      <PedidoEmailItem key={item.clave} item={item} />
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style={styles.totalSection}>
                <h3 style={styles.totalText}>
                  Total del Pedido: ${parseFloat(pedido.total).toFixed(2)}
                </h3>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style={styles.footer}>
                <p>
                  Este es un correo de confirmación automático. Si tienes alguna
                  pregunta, contáctanos en contacto@sealmarket.mx
                </p>
                <p>
                  &copy; {new Date().getFullYear()} Seal Market. Todos los
                  derechos reservados.
                </p>
              </td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  );
};

module.exports = PedidoEmail;