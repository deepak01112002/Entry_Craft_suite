import { Eye, Download, Printer, Share2, Calendar, User, Package } from 'lucide-react';
import { ProductEntry } from '@/types/entry';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { generatePDF } from '@/utils/pdfGenerator';

interface EntryCardProps {
  entry: ProductEntry;
}

export const EntryCard = ({ entry }: EntryCardProps) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/entry/${entry.id}`);
  };

  const handleDownload = async () => {
    await generatePDF(entry, 'download');
  };

  const handlePrint = async () => {
    await generatePDF(entry, 'print');
  };

  const handleShare = async () => {
    const pdf = await generatePDF(entry, 'blob');
    if (pdf && navigator.share) {
      try {
        await navigator.share({
          title: `Challan - ${entry.partyName}`,
          text: `Product Processing Entry for ${entry.productName}`,
          files: [new File([pdf], `challan-${entry.id}.pdf`, { type: 'application/pdf' })],
        });
      } catch (err) {
        // Fallback: open WhatsApp with text
        const text = encodeURIComponent(
          `Product Processing Entry\nParty: ${entry.partyName}\nProduct: ${entry.productName}\nDate: ${format(new Date(entry.date), 'dd/MM/yyyy')}`
        );
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    } else {
      const text = encodeURIComponent(
        `Product Processing Entry\nParty: ${entry.partyName}\nProduct: ${entry.productName}\nDate: ${format(new Date(entry.date), 'dd/MM/yyyy')}`
      );
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  return (
    <div className="card-interactive animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-lg">{entry.productName}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <User className="h-3.5 w-3.5" />
                <span>{entry.partyName}</span>
              </div>
            </div>
            <span className="status-badge status-badge-primary">
              {entry.processType}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(entry.date), 'dd MMM yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              <span>Qty: {entry.quantity}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={handleView}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-1" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="text-success border-success/30 hover:bg-success/10">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
    </div>
  );
};
