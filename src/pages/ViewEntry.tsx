import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2, Calendar, User, Package, Ruler, Layers, FileText, PenTool, Trash2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { useEntries } from '@/hooks/useEntries';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/utils/pdfGenerator';
import { format } from 'date-fns';
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

const ViewEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEntry, deleteEntry } = useEntries();

  const entry = id ? getEntry(id) : undefined;

  if (!entry) {
    return (
      <div className="page-container">
        <Header />
        <main className="content-container">
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Entry Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested entry could not be found.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
    if (!entry) return;
    try {
      await deleteEntry(entry.id);
      toast({
        title: 'Entry Deleted',
        description: 'The entry has been deleted successfully',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete entry. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const DetailRow = ({ label, value, icon: Icon, isProcessType }: { label: string; value?: string | number | React.ReactNode; icon?: React.ComponentType<{ className?: string }>; isProcessType?: boolean }) => (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        {isProcessType ? (
          <p className="font-bold text-foreground break-words">{value || '-'}</p>
        ) : (
          <p className="font-medium text-foreground break-words">{value || '-'}</p>
        )}
      </div>
    </div>
  );

  const ImagePreview = ({ label, src }: { label: string; src?: string }) => (
    src ? (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <img src={src} alt={label} className="w-full max-w-xs rounded-lg border border-border" />
      </div>
    ) : null
  );

  return (
    <div className="page-container">
      <Header />

      <main className="content-container pb-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {/* Header Card */}
        <div className="card-elevated mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="status-badge status-badge-primary mb-2 inline-block font-bold text-foreground">
                {entry.processType}
              </span>
              <h1 className="text-2xl font-bold text-foreground">{entry.productName}</h1>
              <p className="text-muted-foreground">{entry.partyName}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Challan No: {entry.challanNumber || entry.id.slice(0, 8).toUpperCase()}</p>
              <p>{formatDate(entry.date, 'dd MMM yyyy')}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download PDF
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

        {/* Details Sections */}
        <div className="space-y-6">
          {/* Basic Details */}
          <div className="form-section">
            <h2 className="form-section-title">
              <Calendar className="h-4 w-4" />
              Basic Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <DetailRow label="Date" value={formatDate(entry.date, 'dd MMMM yyyy')} icon={Calendar} />
              <DetailRow label="Challan Number" value={entry.challanNumber} icon={Package} />
              <DetailRow label="Company" value={entry.unit} icon={Package} />
              <DetailRow label="Party Name" value={entry.partyName} icon={User} />
              <DetailRow label="Product Name" value={entry.productName} icon={Package} />
            </div>
          </div>

          {/* Measurements */}
          <div className="form-section">
            <h2 className="form-section-title">
              <Ruler className="h-4 w-4" />
              Product Measurements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <DetailRow label="Width" value={entry.widthValue} />
                <ImagePreview label="Width Image" src={entry.widthImage} />
              </div>
              <div>
                <DetailRow label="Length" value={entry.lengthValue} />
                <ImagePreview label="Length Image" src={entry.lengthImage} />
              </div>
              <div>
                <DetailRow label="Height" value={entry.heightValue} />
                <ImagePreview label="Height Image" src={entry.heightImage} />
              </div>
            </div>
          </div>

          {/* Process & Quantity */}
          <div className="form-section">
            <h2 className="form-section-title">
              <Layers className="h-4 w-4" />
              Process & Quantity
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
              <DetailRow 
                label="Process Type" 
                value={entry.processType}
                isProcessType={true}
              />
              <DetailRow label="Quantity" value={entry.quantity} />
              <DetailRow label="Balance Qty" value={entry.balanceQty} />
              <DetailRow label="Return Qty" value={entry.returnQuantity} />
            </div>
          </div>

          {/* Packing & Remarks */}
          {(entry.packingDetails || entry.remarks) && (
            <div className="form-section">
              <h2 className="form-section-title">
                <FileText className="h-4 w-4" />
                Packing & Remarks
              </h2>
              <div className="space-y-4">
                {entry.packingDetails && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Packing Details</p>
                    <p className="text-foreground whitespace-pre-wrap">{entry.packingDetails}</p>
                  </div>
                )}
                {entry.remarks && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Remarks</p>
                    <p className="text-foreground whitespace-pre-wrap">{entry.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Authorization */}
          <div className="form-section">
            <h2 className="form-section-title">
              <PenTool className="h-4 w-4" />
              Authorization
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Signature</p>
                {entry.signature ? (
                  <img
                    src={entry.signature}
                    alt="Signature"
                    className="max-w-[200px] h-auto bg-card border border-border rounded-lg p-2"
                  />
                ) : (
                  <p className="text-muted-foreground italic">No signature provided</p>
                )}
              </div>
              <DetailRow label="Authorized By" value={entry.authorizedBy} icon={User} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewEntry;
