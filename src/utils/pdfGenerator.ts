import jsPDF from 'jspdf';
import { ProductEntry } from '@/types/entry';
import { format } from 'date-fns';

const formatDate = (dateString: string, formatStr: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid
    }
    return format(date, formatStr);
  } catch {
    return dateString; // Return original string on error
  }
};

export const generatePDF = async (
  entry: ProductEntry,
  action: 'download' | 'print' | 'blob'
): Promise<Blob | void> => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  // Company name for title
  const companyName = entry.unit || 'Product Processing';

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName.toUpperCase(), pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('PRODUCT PROCESSING CHALLAN', pageWidth / 2, 24, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(entry.date, 'dd/MM/yyyy')}`, pageWidth / 2, 32, { align: 'center' });
  doc.text(`Challan No: ${entry.challanNumber || entry.id.slice(0, 8).toUpperCase()}`, pageWidth / 2, 37, { align: 'center' });

  y = 50;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Highlighted Process Type Box
  doc.setFillColor(255, 215, 0); // Gold color for highlight
  doc.rect(margin, y - 4, pageWidth - margin * 2, 12, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`PROCESS TYPE: ${entry.processType.toUpperCase()}`, pageWidth / 2, y + 3, { align: 'center' });
  y += 18;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Helper function for sections
  const addSection = (title: string, content: { label: string; value: string }[]) => {
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 2, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    content.forEach((item) => {
      if (item.value) {
        doc.text(`${item.label}:`, margin + 2, y);
        doc.text(item.value, margin + 45, y);
        y += 6;
      }
    });
    y += 4;
  };

  // Basic Details
  addSection('BASIC DETAILS', [
    { label: 'Party Name', value: entry.partyName },
    { label: 'Product Name', value: entry.productName },
    { label: 'Company', value: entry.unit || '-' },
  ]);

  // Product Measurements
  addSection('MEASUREMENTS', [
    { label: 'Width', value: entry.widthValue || '-' },
    { label: 'Length', value: entry.lengthValue || '-' },
    { label: 'Height', value: entry.heightValue || '-' },
  ]);

  // Quantity Details
  addSection('QUANTITY DETAILS', [
    { label: 'Quantity', value: entry.quantity.toString() },
    { label: 'Balance Qty', value: entry.balanceQty?.toString() || '-' },
    { label: 'Return Qty', value: entry.returnQuantity?.toString() || '-' },
  ]);

  // Packing & Remarks
  if (entry.packingDetails || entry.remarks) {
    addSection('PACKING & REMARKS', [
      { label: 'Packing', value: entry.packingDetails || '-' },
      { label: 'Remarks', value: entry.remarks || '-' },
    ]);
  }

  // Add measurement images if they exist (without labels below)
  if (entry.widthImage || entry.lengthImage || entry.heightImage) {
    if (y > 200) {
      doc.addPage();
      y = 20;
    }
    
    y += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('MEASUREMENT IMAGES', margin, y);
    y += 8;

    let xOffset = margin;
    if (entry.widthImage) {
      try {
        doc.addImage(entry.widthImage, 'JPEG', xOffset, y, 50, 40);
        xOffset += 55;
      } catch (e) {}
    }
    if (entry.lengthImage) {
      try {
        doc.addImage(entry.lengthImage, 'JPEG', xOffset, y, 50, 40);
        xOffset += 55;
      } catch (e) {}
    }
    if (entry.heightImage) {
      try {
        doc.addImage(entry.heightImage, 'JPEG', xOffset, y, 50, 40);
      } catch (e) {}
    }
    y += 50;
  }

  // Authorization Section
  y = Math.max(y, 230);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('AUTHORIZATION', margin, y);
  y += 8;

  if (entry.signature) {
    try {
      doc.addImage(entry.signature, 'PNG', margin, y, 40, 20);
    } catch (e) {}
  }
  
  doc.setFont('helvetica', 'normal');
  doc.text('Authorized By:', pageWidth - margin - 60, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.text(entry.authorizedBy, pageWidth - margin - 60, y + 12);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('This is a computer-generated document.', pageWidth / 2, footerY, { align: 'center' });

  if (action === 'download') {
    doc.save(`challan-${entry.partyName}-${formatDate(entry.date, 'ddMMyyyy')}.pdf`);
  } else if (action === 'print') {
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  } else if (action === 'blob') {
    return doc.output('blob');
  }
};
