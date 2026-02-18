const React = require('react');
const PedidoEmailItem = require('./PedidoEmailItem');

const PedidoEmail = ({ pedido }) => {
  const primerNombre = pedido.enviar_a ? pedido.enviar_a.split(' ')[0] : 'Cliente';
  const domicilio = pedido.domicilio || {};
  const referenciaPago = pedido.folio ? pedido.folio.toString().substring(0, 8) : '';
  const logoUrl = "https://www.sealmarket.net/Sugeridos/logo.png";

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
      fontFamily: "Arial, sans-serif",
      borderCollapse: "collapse" // Importante para evitar micro-espacios
    },
    // Estilo unificado para la celda del encabezado
    headerContainer: {
      backgroundColor: "#2177c2",
      color: "#ffffff",
      padding: "25px 20px",
      textAlign: "left",
    },
    headerTitle: { margin: 0, fontSize: "24px", color: "#ffffff" },
    headerSubtitle: { margin: "5px 0 0 0", fontSize: "14px", opacity: 0.9, color: "#ffffff" },
    content: { padding: "20px" },
    // ... (los demás estilos se mantienen igual)
    orderDetailsBox: {
      border: "1px solid #dddddd",
      padding: "15px",
      backgroundColor: "#f9f9f9",
      marginBottom: "20px",
      fontSize: "14px"
    },
    bankInfoBox: {
      border: "1px solid #d4edda",
      padding: "15px",
      backgroundColor: "#f8fff9",
      marginBottom: "20px",
      fontSize: "14px",
      color: "#155724"
    },
    itemsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "30px",
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
        <table cellPadding="0" cellSpacing="0" border="0" style={styles.container}>
          <thead>
            <tr>
              {/* SOLUCIÓN: Una sola celda que contiene todo el diseño del header */}
              <td colSpan="2" style={styles.headerContainer}>
                <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                  <tr>
                    <td style={{ verticalAlign: "middle" }}>
                      <h1 style={styles.headerTitle}>¡Hola, {primerNombre}!</h1>
                      <p style={styles.headerSubtitle}>
                        <strong>Confirmación de Pedido:</strong> #{pedido.folio}
                      </p>
                      <p style={styles.headerSubtitle}>
                        <strong>Estatus:</strong> {pedido.estatus} | <strong>Fecha:</strong> {formatDate(pedido.createdAt)}
                      </p>
                    </td>
                    <td style={{ textAlign: "right", verticalAlign: "middle", width: "120px" }}>
                      <img
                        src={logoUrl}
                        alt="Seal Market"
                        width="100"
                        style={{
                          display: "block",
                          marginLeft: "auto",
                          border: "0",
                          width: "100px",
                          height: "auto"
                        }}
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.content} colSpan="2">
                {/* 1. DETALLES DE ENVÍO */}
                <div style={styles.orderDetailsBox}>
                  <p style={{ margin: "0 0 10px 0", fontWeight: "bold", borderBottom: "1px solid #cccccc", color: "#2177c2" }}>
                    DETALLES DE ENVÍO:
                  </p>
                  <p style={{ margin: "3px 0" }}><strong>{pedido.enviar_a}</strong></p>
                  <p style={{ margin: "3px 0" }}>
                    {domicilio.calle} #{domicilio.numero_ext}{domicilio.numero_int ? `, Int. ${domicilio.numero_int}` : ''}
                  </p>
                  <p style={{ margin: "3px 0" }}>Col. {domicilio.colonia}, C.P. {domicilio.codigo_postal}</p>
                  <p style={{ margin: "3px 0" }}>{domicilio.ciudad}, {domicilio.estado}</p>

                  <p style={{ margin: "10px 0 0 0", paddingTop: "10px", borderTop: "1px dashed #cccccc" }}>
                    <strong>Forma de pago:</strong> {pedido.tipo_logistica === 'pagoTransf' ? 'Transferencia Bancaria' : pedido.tipo_logistica}
                  </p>
                </div>

                {/* 2. DATOS BANCARIOS */}
                {pedido.tipo_logistica === 'pagoTransf' && (
                  <div style={styles.bankInfoBox}>
                    <p style={{ margin: "0 0 10px 0", borderBottom: "1px solid #c3e6cb", paddingBottom: "5px" }}>
                      <span style={{ fontWeight: "bold", color: "#155724", fontSize: "14px" }}>
                        DATOS PARA LA TRANSFERENCIA:
                      </span>
                      <span style={{ color: "#d9534f", fontSize: "12px", marginLeft: "10px", fontStyle: "italic" }}>
                        &nbsp;&nbsp;(Su pedido comenzará a procesarse una vez confirmado el pago)
                      </span>
                    </p>
                    <table cellPadding="0" cellSpacing="0" style={{ fontSize: "13px", width: "100%" }}>
                      <tr><td style={{ padding: "2px 0" }}><strong>Banco:</strong> BBVA Bancomer</td></tr>
                      <tr><td style={{ padding: "2px 0" }}><strong>Titular:</strong> Alberto Rodríguez Salas</td></tr>
                      <tr><td style={{ padding: "2px 0" }}><strong>CLABE:</strong> 012933004798737322</td></tr>
                    </table>
                    <p style={{ margin: "15px 0 5px 0" }}><strong>Referencia de Pago:</strong></p>
                    <div style={{ backgroundColor: "#e2e3e5", padding: "5px 10px", borderRadius: "4px", fontWeight: "bold", fontSize: "16px", color: "#383d41", display: "inline-block" }}>
                      {referenciaPago}
                    </div>
                  </div>
                )}

                {/* 3. TABLA DE PRODUCTOS */}
                <table style={styles.itemsTable} cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th style={{ borderBottom: "2px solid #333333", padding: "10px 5px", textAlign: "left", fontSize: "13px", color: "#333333", backgroundColor: "#eeeeee" }}>Producto</th>
                      <th style={{ borderBottom: "2px solid #333333", padding: "10px 5px", textAlign: "center", width: "80px", color: "#333333", backgroundColor: "#eeeeee" }}>Cant.</th>
                      <th style={{ borderBottom: "2px solid #333333", padding: "10px 5px", textAlign: "right", width: "120px", color: "#333333", backgroundColor: "#eeeeee" }}>Total</th>
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
              <td style={styles.totalSection} colSpan="2">
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                  Total del Pedido: ${parseFloat(pedido.total).toFixed(2)}
                </p>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style={styles.footer} colSpan="2">
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