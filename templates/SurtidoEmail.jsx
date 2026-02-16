// /SurtidoEmail/SurtidoEmail.jsx

const React = require("react");
const SurtidoEmailItem = require("./SurtidoEmailItem"); 

const SurtidoEmail = ({ envio }) => {
  const styles = {
    container: {
      maxWidth: "800px", // Aumentado ligeramente para las nuevas columnas
      margin: "0 auto",
      backgroundColor: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      overflow: "hidden",
      fontFamily: "Arial, sans-serif"
    },
    header: {
      backgroundColor: "#d9534e",
      color: "#ffffff",
      padding: "20px",
      textAlign: "left",
    },
    headerTitle: { margin: 0, fontSize: "24px" },
    headerSubtitle: { margin: "5px 0 0 0", fontSize: "14px", opacity: 0.9 },
    content: { padding: "20px" },
    addressDetails: {
      border: "1px solid #ddd",
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
        borderBottom: "2px solid #333",
        padding: "10px 5px",
        textAlign: "left",
        fontSize: "13px",
        color: "#333",
        backgroundColor: "#eee"
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
      <body>
        <table cellPadding="0" cellSpacing="0" style={styles.container}>
          <thead>
            <tr>
              <td style={styles.header}>
                <h1 style={styles.headerTitle}>🚨 NUEVO PEDIDO PARA SURTIR (PRUEBA)</h1>
                <p style={styles.headerSubtitle}>
                  <strong>Almacén Responsable:</strong> {envio.almacen_asignado} | <strong>Folio Envío:</strong> {envio.folio}
                </p>
                <p style={styles.headerSubtitle}>
                  <strong>Pedido:</strong> {envio.folio_pedido} | <strong>Logística:</strong> {envio.tipo_logistica}
                </p>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.content}>
                <div style={styles.addressDetails}>
                    <p style={{ margin: "0 0 10px 0", fontWeight: "bold", borderBottom: "1px solid #ccc" }}>DATOS DE ENTREGA:</p>
                    <p style={{ margin: "3px 0" }}><strong>{destino.nombre_completo}</strong></p>
                    <p style={{ margin: "3px 0" }}>{destino.calle} #{destino.numero_ext}, Col. {destino.colonia}</p>
                    <p style={{ margin: "3px 0" }}>{destino.ciudad}, {destino.estado} | CP: {destino.codigo_postal}</p>
                    <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#666 italic" }}>
                        <strong>Instrucciones:</strong> {destino.instrucciones_entrega || 'Sin instrucciones adicionales'}
                    </p>
                </div>

                <table style={styles.itemsTable} cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th style={styles.itemsTh}>Producto / Descripción</th>
                      <th style={{ ...styles.itemsTh, textAlign: "center", width: "80px" }}>Cant.</th>
                      <th style={{ ...styles.itemsTh, width: "120px" }}>Últ. Compra</th>
                      <th style={{ ...styles.itemsTh, textAlign: "right", width: "100px" }}>Últ. Costo</th>
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
                <p>Aviso generado automáticamente para surtido de ventas en línea.</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  );
    {/* <html>
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

                
                <table style={styles.itemsTable} cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th style={styles.itemsTh}>Producto / Descripción</th>
                      <th style={{ ...styles.itemsTh, textAlign: "center" }}>
                        Cantidad a Surtir
                      </th>
                      <th style={{ ...styles.itemsTh, textAlign: "center" }}>
                        Existencias
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
    </html> */}

};

module.exports = SurtidoEmail;