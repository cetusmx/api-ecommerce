// /SurtidoEmail/SurtidoEmail.jsx

const React = require("react");
const SurtidoEmailItem = require("./SurtidoEmailItem"); 

const SurtidoEmail = ({ envio }) => {
  const styles = {
    // ... (Mantén los mismos estilos generales de PedidoEmail.jsx)
    container: {
      maxWidth: "680px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      overflow: "hidden",
    },
    header: {
      backgroundColor: "#d9534e", // Un color distintivo para interno
      color: "#ffffff",
      padding: "30px 20px",
      textAlign: "left",
    },
    headerTitle: {
      margin: 0,
      fontSize: "28px",
    },
    content: {
      padding: "30px",
    },
    // ... otros estilos ...
    addressDetails: {
      border: "1px solid #ddd",
      padding: "15px",
      backgroundColor: "#f9f9f9",
      marginBottom: "30px",
    },
    itemsTable: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "30px",
    },
    itemsTh: {
        borderBottom: "2px solid #333",
        padding: "10px 0",
        textAlign: "left",
        fontSize: "16px",
        color: "#333"
    },
    footer: {
      backgroundColor: "#f4f4f4",
      padding: "20px",
      textAlign: "center",
      fontSize: "12px",
      color: "#666",
      borderTop: "1px solid #ddd",
    },
  };

  const destino = envio.destino;

  return (
    <html>
      <body style={styles.body}>
        <table cellPadding="0" cellSpacing="0" style={styles.container}>
          <thead>
            <tr>
              <td style={styles.header}>
                <h1 style={styles.headerTitle}>
                  🚨 NUEVO SURTIDO (ALM. {envio.almacen_asignado})
                </h1>
                <p style={styles.headerSubtitle}>
                  **Folio Envío:** {envio.folio} | **Folio Pedido:** {envio.folio_pedido}
                </p>
                <p style={styles.headerSubtitle}>
                  **Tipo Logística:** {envio.tipo_logistica}
                </p>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.content}>
                <h2>Detalles de Surtido</h2>
                
                {/* 1. SECCIÓN DE DESTINO PARA LA GUÍA */}
                <div style={styles.addressDetails}>
                    <p style={{ margin: 0, fontWeight: "bold" }}>DESTINO FINAL:</p>
                    <p style={{ margin: "5px 0" }}>
                        **{destino.nombre_completo}** | Tel: {destino.numero_telefono}
                    </p>
                    <p style={{ margin: "5px 0" }}>
                        {destino.calle} #{destino.numero_ext}{destino.numero_int ? ` Int. ${destino.numero_int}` : ''}, Col. {destino.colonia}
                    </p>
                    <p style={{ margin: "5px 0" }}>
                        {destino.ciudad}, {destino.estado}, C.P. {destino.codigo_postal}
                    </p>
                    <p style={{ margin: "5px 0", color: "#666" }}>
                        **Instrucciones:** {destino.instrucciones_entrega || 'N/A'}
                    </p>
                </div>

                {/* 2. SECCIÓN DE PRODUCTOS A SURTIR */}
                <table style={styles.itemsTable} cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th style={styles.itemsTh}>Producto / Descripción</th>
                      <th style={{ ...styles.itemsTh, textAlign: "center" }}>
                        Cantidad a Surtir
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {envio.items_envio.map((item) => (
                      <SurtidoEmailItem key={item.clave} item={item} />
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style={styles.footer}>
                <p>
                  Este es un aviso automático de un nuevo envío. Favor de surtirlo lo antes posible.
                </p>
                <p>
                  Cualquier duda, contacte al área de ventas.
                </p>
              </td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  );
};

module.exports = SurtidoEmail;