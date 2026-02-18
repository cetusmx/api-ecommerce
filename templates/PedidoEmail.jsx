const React = require('react');
const PedidoEmailItem = require('./PedidoEmailItem');

const PedidoEmail = ({ pedido }) => {
  // Extraer el primer nombre para el saludo
  const primerNombre = pedido.enviar_a ? pedido.enviar_a.split(' ')[0] : 'Cliente';
  
  // Extraer el objeto domicilio según tu instrucción
  const domicilio = pedido.domicilio || {};

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      border: "1px solid #dddddd",
      borderRadius: "8px",
      overflow: "hidden",
      fontFamily: "Arial, sans-serif"
    },
    header: {
      backgroundColor: "#2177c2",
      color: "#ffffff",
      padding: "20px",
      textAlign: "left",
    },
    headerTitle: { margin: 0, fontSize: "24px" },
    headerSubtitle: { margin: "5px 0 0 0", fontSize: "14px", opacity: 0.9 },
    content: { padding: "20px" },
    orderDetailsBox: {
      border: "1px solid #dddddd",
      padding: "15px",
      backgroundColor: "#f9f9f9",
      marginBottom: "20px",
      fontSize: "14px"
    },
    itemsTable: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "30px",
    },
    itemsTh: {
        borderBottom: "2px solid #333333",
        padding: "10px 5px",
        textAlign: "left",
        fontSize: "13px",
        color: "#333333",
        backgroundColor: "#eeeeee"
    },
    totalSection: {
      padding: "20px",
      textAlign: "right",
      backgroundColor: "#f9f9f9",
      borderTop: "1px solid #dddddd",
    },
    footer: {
      backgroundColor: "#f4f4f4",
      padding: "20px",
      textAlign: "center",
      fontSize: "12px",
      color: "#666666",
      borderTop: "1px solid #dddddd",
    },
  };

  return (
    <html lang="es">
      <body style={{ margin: 0, padding: "20px", backgroundColor: "#f4f4f4" }}>
        <table cellPadding="0" cellSpacing="0" style={styles.container}>
          <thead>
            <tr>
              <td style={styles.header}>
                <h1 style={styles.headerTitle}>¡Hola, {primerNombre}!</h1>
                <p style={styles.headerSubtitle}>
                  <strong>Confirmación de Pedido:</strong> #{pedido.folio}
                </p>
                <p style={styles.headerSubtitle}>
                  <strong>Estatus:</strong> {pedido.estatus} | <strong>Fecha:</strong> {formatDate(pedido.createdAt)}
                </p>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.content}>
                <div style={styles.orderDetailsBox}>
                    <p style={{ margin: "0 0 10px 0", fontWeight: "bold", borderBottom: "1px solid #cccccc", color: "#2177c2" }}>
                        DETALLES DE ENVÍO:
                    </p>
                    {/* Sección de Domicilio similar a SurtidoEmail */}
                    <p style={{ margin: "3px 0" }}><strong>Entregar a:</strong> {pedido.enviar_a}</p>
                    <p style={{ margin: "3px 0" }}>
                        {domicilio.calle} #{domicilio.numero_ext}{domicilio.numero_int ? `, Int. ${domicilio.numero_int}` : ''}
                    </p>
                    <p style={{ margin: "3px 0" }}>Col. {domicilio.colonia}, C.P. {domicilio.codigo_postal}</p>
                    <p style={{ margin: "3px 0" }}>{domicilio.ciudad}, {domicilio.estado}</p>
                    
                    {/* Forma de pago extraída de tipo_logistica */}
                    <p style={{ margin: "10px 0 0 0", paddingTop: "10px", borderTop: "1px dashed #cccccc" }}>
                        <strong>Forma de pago:</strong> {pedido.tipo_logistica}
                    </p>
                </div>

                <table style={styles.itemsTable} cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th style={styles.itemsTh}>Producto</th>
                      <th style={{ ...styles.itemsTh, textAlign: "center", width: "80px" }}>Cant.</th>
                      <th style={{ ...styles.itemsTh, textAlign: "right", width: "120px" }}>Total</th>
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
                    <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                        Total del Pedido: ${parseFloat(pedido.total).toFixed(2)}
                    </p>
                </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style={styles.footer}>
                <p>Este es un correo automático. Si tienes dudas, escríbenos a contacto@sealmarket.mx</p>
                <p>&copy; {new Date().getFullYear()} Seal Market. Todos los derechos reservados.</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  );
};

module.exports = PedidoEmail;