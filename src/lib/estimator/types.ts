import { PriceConfiguration } from '@/types/debufa';

export interface EstimatorDimensions {
  length: number; // in cm or m
  height: number; // in cm or m
  depth: number; // in cm or m
  unit: 'cm' | 'meter';
}

export interface EstimatorCalculationInput {
  furnitureTypeId: string;
  dimensions: EstimatorDimensions;
  materialId: string;
  finishingId: string;
  hardwareId: string;
  quantity: number;
  additionalAccessories?: {
    ledStrip?: boolean;
    cerminBevel?: boolean;
    stopKontakPopUp?: boolean;
    rakPiringStainless?: boolean;
  };
}

export interface EstimatorCostBreakdown {
  baseRatePerUnit: number;
  meterEquivalent: number; // Total meter lari atau unit
  furnitureBaseCost: number;
  materialCost: number;
  finishingCost: number;
  hardwareCost: number;
  accessoriesCost: number;
  unitPrice: number;
  totalPrice: number;
  marginPercent: number;
  estimatedDays: number;
}
