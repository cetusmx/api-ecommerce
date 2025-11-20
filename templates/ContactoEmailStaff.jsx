// /templates/ContactoEmailStaff.jsx
const React = require('react');

const ContactoEmailStaff = ({ nombre, email, telefono, mensaje }) => {
  const styles = {
    body: { fontFamily: 'Arial, sans-serif', color: '#333', backgroundColor: '#f4f4f4', margin: 0, padding: '20px' },
    container: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' },
    header: { backgroundColor: '#c24b21', color: '#ffffff', padding: '30px 20px', textAlign: 'center' },
    headerTitle: { margin: 0, fontSize: '24px' },
    content: { padding: '30px' },
    detailTable: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' },
    detailTd: { padding: '10px 0', fontSize: '14px', borderBottom: '1px solid #eee' },
    detailLabel: { color: '#555', fontWeight: 'bold', width: '30%' },
    messageBox: { backgroundColor: '#f9f9f9', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', whiteSpace: 'pre-wrap' },
    footer: { padding: '20px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #eee' },
  };

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nuevo Mensaje de Contacto</title>
      </head>
      <body style={styles.body}>
        <table style={styles.container} cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
              <th style={styles.header}>
                <h1 style={styles.headerTitle}>🚨 Nuevo Mensaje de Contacto</h1>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.content}>
                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                  Has recibido un nuevo mensaje a través del formulario de contacto.
                </p>

                <table style={styles.detailTable} cellPadding="0" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td style={styles.detailTd}>
                        <span style={styles.detailLabel}>Nombre:</span>
                      </td>
                      <td style={styles.detailTd}>{nombre}</td>
                    </tr>
                    <tr>
                      <td style={styles.detailTd}>
                        <span style={styles.detailLabel}>Email:</span>
                      </td>
                      <td style={styles.detailTd}>{email}</td>
                    </tr>
                    <tr>
                      <td style={styles.detailTd}>
                        <span style={styles.detailLabel}>Teléfono:</span>
                      </td>
                      <td style={styles.detailTd}>{telefono || 'No proporcionado'}</td>
                    </tr>
                  </tbody>
                </table>

                <p style={{ fontWeight: 'bold', margin: '20px 0 10px 0' }}>Mensaje:</p>
                <div style={styles.messageBox}>
                  {mensaje}
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style={styles.footer}>
                <p>Favor de responder a este cliente a la brevedad posible.</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  );
};

module.exports = ContactoEmailStaff;