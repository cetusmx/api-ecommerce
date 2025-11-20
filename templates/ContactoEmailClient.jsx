// /templates/ContactoEmailClient.jsx
const React = require('react');

const ContactoEmailClient = ({ nombre }) => {
  const styles = {
    body: { fontFamily: 'Arial, sans-serif', color: '#333', backgroundColor: '#f4f4f4', margin: 0, padding: '20px' },
    container: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' },
    header: { backgroundColor: '#2177c2', color: '#ffffff', padding: '30px 20px', textAlign: 'center' },
    headerTitle: { margin: 0, fontSize: '28px' },
    content: { padding: '30px' },
    paragraph: { lineHeight: '1.6', fontSize: '16px', marginBottom: '15px' },
    footer: { padding: '20px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #eee' },
  };

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirmación de Recepción de Mensaje</title>
      </head>
      <body style={styles.body}>
        <table style={styles.container} cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
              <th style={styles.header}>
                <h1 style={styles.headerTitle}>¡Hola, {nombre}! 👋</h1>
                <p style={{ margin: '5px 0 0', fontSize: '16px' }}>
                  Recibimos tu mensaje
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.content}>
                <p style={styles.paragraph}>
                  Queremos confirmarte que hemos recibido tu mensaje correctamente. ¡Gracias por contactarnos!
                </p>
                <p style={styles.paragraph}>
                  Nuestro equipo lo revisará y te responderá a la brevedad posible. Por lo general, esto no tarda más de 24 horas hábiles.
                </p>
                <p style={styles.paragraph}>
                  Mientras tanto, puedes seguir explorando nuestra tienda.
                </p>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style={styles.footer}>
                <p>
                  Este es un correo automático. Por favor, no lo respondas.
                </p>
                <p>
                  &copy; {new Date().getFullYear()} Seal Market.
                </p>
              </td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  );
};

module.exports = ContactoEmailClient;