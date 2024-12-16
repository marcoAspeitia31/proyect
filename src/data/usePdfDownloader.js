// Archivo: src/data/usePdfDownloader.js
import { jsPDF } from "jspdf";

export function usePdfDownloader() {
  const downloadPDF = (order) => {
    if (!order) {
      console.error("No se puede descargar el PDF porque no hay datos de pedido.");
      return;
    }

    const pdf = new jsPDF();
    pdf.setFontSize(12);
    pdf.text(`Folio: ${order.folio}`, 10, 10);
    pdf.text(`Cliente: ${order.cliente}`, 10, 20);
    pdf.text(`Teléfono: ${order.telefono}`, 10, 30);
    pdf.text(`Dirección: ${order.direccion}`, 10, 40);
    
    // Encabezados de la tabla
    pdf.setFontSize(10);
    pdf.text("Código", 10, 60);
    pdf.text("Nombre", 50, 60);
    pdf.text("Cantidad", 130, 60);
    pdf.text("Precio", 170, 60);
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(10, 62, 200, 62);
    
    // Listado de artículos
    let y = 100;
    order.articles.forEach((item) => {
      pdf.text(item.codigo, 10, y);
      pdf.text(item.nombre, 50, y, { maxWidth: 100 });
      pdf.text(item.cantidad, 130, y);
      pdf.text(`$${item.total}`, 170, y);
      y += 10;
    });
    
    y += 10;
    pdf.text(`Subtotal: $${order.subtotal}`, 130, y);
    pdf.text(`Envío: $${order.envio}`, 130, y + 10);
    pdf.text(`Total: $${order.total}`, 130, y + 20);
    
    // Guardar el PDF con un nombre basado en el folio
    const fileName = `detalle_${order.folio}.pdf`;
    pdf.save(fileName);
  };

  return { downloadPDF };
}
