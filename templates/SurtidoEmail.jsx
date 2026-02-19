// /SurtidoEmail/SurtidoEmail.jsx

const React = require("react");
const SurtidoEmailItem = require("./SurtidoEmailItem");

const SurtidoEmail = ({ envio }) => {

  const referenciaPago = envio.folio_pedido ? envio.folio_pedido.toString().substring(0, 8) : '';

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
    bankInfoBox: {
      border: "1px solid #d4edda",
      padding: "15px",
      backgroundColor: "#f8fff9",
      marginBottom: "20px",
      fontSize: "14px",
      color: "#155724"
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
                <h1 style={styles.headerTitle}>🚨 NUEVO PEDIDO PARA SURTIR</h1>
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
                {/* 2. NUEVO: RENDERIZADO CONDICIONAL PARA TRANSFERENCIA */}
                {envio.tipo_logistica === 'pagoTransf' && (
                  <div style={styles.bankInfoBox}>
                    <p style={{ margin: "0 0 10px 0", borderBottom: "1px solid #c3e6cb", paddingBottom: "5px" }}>
                      <span style={{ fontWeight: "bold", color: "#155724", fontSize: "14px" }}>
                        PAGO POR TRANSFERENCIA
                      </span>
                    </p>
                    <p>
                      <span style={{ color: "#d9534f", fontSize: "14px", margin: "10px 0 10px 0" }}>
                        Procesar envío hasta confirmar el pago
                      </span>
                    </p>
                    <p style={{ margin: "15px 0 5px 0" }}><strong>Referencia de Pago:</strong></p>
                    <div style={{ backgroundColor: "#e2e3e5", padding: "5px 10px", borderRadius: "4px", fontWeight: "bold", fontSize: "16px", color: "#383d41", display: "inline-block" }}>
                      {referenciaPago}
                    </div>
                    <p style={{ margin: "15px 0 0 0", fontSize: "13px" }}>
                      El comprobante se recibirá en: pagos@sealmarket.mx
                    </p>
                  </div>
                )}
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

};

module.exports = SurtidoEmail;