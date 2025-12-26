import { Eye, Download, Printer, Share2, Calendar, User, Package, Trash2 } from 'lucide-react';
import { ProductEntry } from '@/types/entry';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { generatePDF } from '@/utils/pdfGenerator';
import { useEntries } from '@/hooks/useEntries';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EntryCardProps {
  entry: ProductEntry;
}

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

export const EntryCard = ({ entry }: EntryCardProps) => {
  const navigate = useNavigate();
  const { deleteEntry } = useEntries();

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
          `Product Processing Entry\nParty: ${entry.partyName}\nProduct: ${entry.productName}\nDate: ${formatDate(entry.date, 'dd/MM/yyyy')}`
        );
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    } else {
      const text = encodeURIComponent(
        `Product Processing Entry\nParty: ${entry.partyName}\nProduct: ${entry.productName}\nDate: ${formatDate(entry.date, 'dd/MM/yyyy')}`
      );
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEntry(entry.id);
      toast({
        title: 'Entry Deleted',
        description: 'The entry has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete entry. Please try again.',
        variant: 'destructive',
      });
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
            <span className="status-badge status-badge-primary font-bold text-foreground">
              {entry.processType}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(entry.date, 'dd MMM yyyy')}</span>
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Entry</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this entry? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
