import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Check, RotateCcw } from 'lucide-react';
import { Header } from '@/components/Header';
import { ImageUpload } from '@/components/ImageUpload';
import { SignaturePad } from '@/components/SignaturePad';
import { useEntries } from '@/hooks/useEntries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { PROCESS_TYPES } from '@/types/entry';
import { useConfig } from '@/context/ConfigContext';
import { cn } from '@/lib/utils';

interface FormData {
  date: Date | undefined;
  challanNumber: string;
  unit: string;
  partyName: string;
  productName: string;
  widthImage?: string;
  widthValue: string;
  lengthImage?: string;
  lengthValue: string;
  heightImage?: string;
  heightValue: string;
  processType: string;
  quantity: string;
  balanceQty: string;
  returnQuantity: string;
  packingDetails: string;
  remarks: string;
  signature?: string;
  authorizedBy: string;
}

const initialFormData: FormData = {
  date: undefined,
  challanNumber: '',
  unit: '',
  partyName: '',
  productName: '',
  widthImage: undefined,
  widthValue: '',
  lengthImage: undefined,
  lengthValue: '',
  heightImage: undefined,
  heightValue: '',
  processType: '',
  quantity: '',
  balanceQty: '',
  returnQuantity: '',
  packingDetails: '',
  remarks: '',
  signature: undefined,
  authorizedBy: '',
};

interface ValidationErrors {
  [key: string]: string;
}

const AddEntry = () => {
  const navigate = useNavigate();
  const { addEntry } = useEntries();
  const { config } = useConfig();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const companyOptions = config?.companyUnits || [];

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.partyName.trim()) newErrors.partyName = 'Party name is required';
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.processType) newErrors.processType = 'Process type is required';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!formData.authorizedBy.trim()) newErrors.authorizedBy = 'Authorization name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addEntry({
        date: format(formData.date!, 'yyyy-MM-dd'),
        challanNumber: formData.challanNumber.trim(),
        unit: formData.unit,
        partyName: formData.partyName.trim(),
        productName: formData.productName.trim(),
        widthImage: formData.widthImage,
        widthValue: formData.widthValue.trim() || undefined,
        lengthImage: formData.lengthImage,
        lengthValue: formData.lengthValue.trim() || undefined,
        heightImage: formData.heightImage,
        heightValue: formData.heightValue.trim() || undefined,
        processType: formData.processType,
        quantity: parseInt(formData.quantity),
        balanceQty: formData.balanceQty ? parseInt(formData.balanceQty) : undefined,
        returnQuantity: formData.returnQuantity ? parseInt(formData.returnQuantity) : undefined,
        packingDetails: formData.packingDetails.trim() || undefined,
        remarks: formData.remarks.trim() || undefined,
        signature: formData.signature,
        authorizedBy: formData.authorizedBy.trim(),
      });

      toast({
        title: 'Entry Created',
        description: 'Product processing entry has been saved successfully',
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
  };

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

        <h1 className="text-2xl font-bold text-foreground mb-6">Product Processing Entry</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Details */}
          <div className="form-section">
            <h2 className="form-section-title">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
              Basic Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="input-group">
                <Label className="input-label input-required">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.date && 'text-muted-foreground',
                        errors.date && 'border-destructive'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, 'dd MMM yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => updateField('date', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
              </div>

              <div className="input-group">
                <Label className="input-label">Challan Number</Label>
                <Input
                  type="text"
                  value={formData.challanNumber}
                  onChange={(e) => updateField('challanNumber', e.target.value)}
                  placeholder="Enter challan number"
                />
              </div>

              <div className="input-group">
                <Label className="input-label">Unit (Company)</Label>
                <Select value={formData.unit} onValueChange={(v) => updateField('unit', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyOptions.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="input-group">
                <Label className="input-label input-required">Party Name</Label>
                <Input
                  type="text"
                  value={formData.partyName}
                  onChange={(e) => updateField('partyName', e.target.value)}
                  placeholder="Enter party name"
                  className={errors.partyName ? 'border-destructive' : ''}
                />
                {errors.partyName && <p className="text-xs text-destructive mt-1">{errors.partyName}</p>}
              </div>

              <div className="input-group sm:col-span-2">
                <Label className="input-label input-required">Product Name</Label>
                <Input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => updateField('productName', e.target.value)}
                  placeholder="Enter product name"
                  className={errors.productName ? 'border-destructive' : ''}
                />
                {errors.productName && <p className="text-xs text-destructive mt-1">{errors.productName}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Product Measurements */}
          <div className="form-section">
            <h2 className="form-section-title">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
              Product Measurements
            </h2>

            <div className="space-y-6">
              {/* Width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <ImageUpload
                  label="Width Image (Optional)"
                  value={formData.widthImage}
                  onChange={(v) => updateField('widthImage', v)}
                />
                <div className="input-group self-end">
                  <Label className="input-label">Width Value</Label>
                  <Input
                    type="text"
                    value={formData.widthValue}
                    onChange={(e) => updateField('widthValue', e.target.value)}
                    placeholder="e.g., 12 inch, 30 cm"
                  />
                </div>
              </div>

              {/* Length */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <ImageUpload
                  label="Length Image (Optional)"
                  value={formData.lengthImage}
                  onChange={(v) => updateField('lengthImage', v)}
                />
                <div className="input-group self-end">
                  <Label className="input-label">Length Value</Label>
                  <Input
                    type="text"
                    value={formData.lengthValue}
                    onChange={(e) => updateField('lengthValue', e.target.value)}
                    placeholder="e.g., 24 inch, 60 cm"
                  />
                </div>
              </div>

              {/* Height */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <ImageUpload
                  label="Height Image (Optional)"
                  value={formData.heightImage}
                  onChange={(v) => updateField('heightImage', v)}
                />
                <div className="input-group self-end">
                  <Label className="input-label">Height Value</Label>
                  <Input
                    type="text"
                    value={formData.heightValue}
                    onChange={(e) => updateField('heightValue', e.target.value)}
                    placeholder="e.g., 6 inch, 15 cm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Process Details */}
          <div className="form-section">
            <h2 className="form-section-title">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
              Process Details
            </h2>

            <div className="input-group">
              <Label className="input-label input-required">Process Type</Label>
              <Select value={formData.processType} onValueChange={(v) => updateField('processType', v)}>
                <SelectTrigger className={errors.processType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select process type" />
                </SelectTrigger>
                <SelectContent>
                  {PROCESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.processType && <p className="text-xs text-destructive mt-1">{errors.processType}</p>}
            </div>
          </div>

          {/* Section 4: Quantity Details */}
          <div className="form-section">
            <h2 className="form-section-title">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">4</span>
              Quantity Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="input-group">
                <Label className="input-label input-required">Quantity</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => updateField('quantity', e.target.value)}
                  placeholder="Enter quantity"
                  className={errors.quantity ? 'border-destructive' : ''}
                />
                {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity}</p>}
              </div>

              <div className="input-group">
                <Label className="input-label">Balance Qty</Label>
                <Input
                  type="number"
                  value={formData.balanceQty}
                  onChange={(e) => updateField('balanceQty', e.target.value)}
                  placeholder="Enter balance qty"
                />
              </div>

              <div className="input-group">
                <Label className="input-label">Return Qty</Label>
                <Input
                  type="number"
                  value={formData.returnQuantity}
                  onChange={(e) => updateField('returnQuantity', e.target.value)}
                  placeholder="Enter return qty"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Packing & Remarks */}
          <div className="form-section">
            <h2 className="form-section-title">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">5</span>
              Packing & Remarks
            </h2>

            <div className="space-y-4">
              <div className="input-group">
                <Label className="input-label">Packing Details</Label>
                <Textarea
                  value={formData.packingDetails}
                  onChange={(e) => updateField('packingDetails', e.target.value)}
                  placeholder="Enter packing details..."
                  rows={3}
                />
              </div>

              <div className="input-group">
                <Label className="input-label">Remarks</Label>
                <Textarea
                  value={formData.remarks}
                  onChange={(e) => updateField('remarks', e.target.value)}
                  placeholder="Enter any remarks..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Section 6: Authorization */}
          <div className="form-section">
            <h2 className="form-section-title">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">6</span>
              Authorization
            </h2>

            <div className="space-y-4">
              <div className="input-group">
                <Label className="input-label">Signature</Label>
                <SignaturePad
                  value={formData.signature}
                  onChange={(v) => updateField('signature', v)}
                />
              </div>

              <div className="input-group">
                <Label className="input-label input-required">Authorized By</Label>
                <Input
                  type="text"
                  value={formData.authorizedBy}
                  onChange={(e) => updateField('authorizedBy', e.target.value)}
                  placeholder="Enter authorized person's name"
                  className={errors.authorizedBy ? 'border-destructive' : ''}
                />
                {errors.authorizedBy && (
                  <p className="text-xs text-destructive mt-1">{errors.authorizedBy}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleReset} className="flex-1 sm:flex-none">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              <Check className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Submit Entry'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddEntry;
