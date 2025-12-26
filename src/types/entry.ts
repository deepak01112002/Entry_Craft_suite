export interface ProductEntry {
  id: string;
  date: string;
  challanNumber: string;
  unit: string; // Company name
  partyName: string;
  productName: string;
  widthImage?: string;
  widthValue?: string;
  lengthImage?: string;
  lengthValue?: string;
  heightImage?: string;
  heightValue?: string;
  processType: string;
  quantity: number;
  balanceQty?: number;
  returnQuantity?: number;
  packingDetails?: string;
  remarks?: string;
  signature?: string;
  authorizedBy: string;
  createdAt: string;
}

export type ProcessType = 'Gold' | 'RoseGold' | 'Black' | 'Gun';

export const PROCESS_TYPES: ProcessType[] = ['Gold', 'RoseGold', 'Black', 'Gun'];
export const COMPANY_OPTIONS = ['SP PVD TECH', 'SP TECNO COATING'] as const;

