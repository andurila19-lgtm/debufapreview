import { PriceConfiguration } from '@/types/debufa';
import { EstimatorCalculationInput, EstimatorCostBreakdown } from './types';
import { ACCESSORY_RULES } from './rules';

export function calculateFurnitureEstimate(
  input: EstimatorCalculationInput,
  priceConfig: PriceConfiguration
): EstimatorCostBreakdown {
  const {
    furnitureTypeId,
    dimensions,
    materialId,
    finishingId,
    hardwareId,
    quantity = 1,
    additionalAccessories = {}
  } = input;

  // 1. Convert dimensions to meters
  const lengthM = dimensions.unit === 'cm' ? dimensions.length / 100 : dimensions.length;
  const heightM = dimensions.unit === 'cm' ? dimensions.height / 100 : dimensions.height;
  const depthM = dimensions.unit === 'cm' ? dimensions.depth / 100 : dimensions.depth;

  // 2. Find selected config items
  const furnItem =
    priceConfig.furnitureTypes.find((f) => f.id === furnitureTypeId) ||
    priceConfig.furnitureTypes[0];

  const matItem =
    priceConfig.materials.find((m) => m.id === materialId) || priceConfig.materials[0];

  const finItem =
    priceConfig.finishing.find((f) => f.id === finishingId) || priceConfig.finishing[0];

  const hwItem = priceConfig.hardware.find((h) => h.id === hardwareId) || priceConfig.hardware[0];

  // 3. Compute meter or area multiplier
  let meterEquivalent = Math.max(1, lengthM);
  if (furnItem.unit === 'm²') {
    meterEquivalent = Math.max(1, lengthM * heightM);
  } else if (furnItem.unit === 'unit') {
    meterEquivalent = 1;
  }

  // 4. Calculate individual components
  const baseRate = furnItem?.price || 2000000;
  const furnitureBaseCost = Math.round(baseRate * meterEquivalent);

  // Material cost calculation
  const matBasePrice = matItem?.price || 250000;
  // Estimate sheet usage: ~ 1 sheet per 1.2 m² or meter lari
  const sheetCount = Math.max(1, Math.ceil(meterEquivalent * 1.2));
  const materialCost = sheetCount * matBasePrice;

  // Finishing cost calculation
  const finBasePrice = finItem?.price || 280000;
  const finArea = meterEquivalent * 2.5; // surface multiplier
  const finishingCost = Math.round(finArea * finBasePrice);

  // Hardware cost calculation
  const hwBasePrice = hwItem?.price || 250000;
  const hardwareCost = Math.round(hwBasePrice * Math.max(1, Math.ceil(meterEquivalent)));

  // Accessories
  let accessoriesCost = 0;
  if (additionalAccessories.ledStrip) {
    accessoriesCost += ACCESSORY_RULES.ledStrip.price * Math.max(1, Math.ceil(lengthM));
  }
  if (additionalAccessories.cerminBevel) {
    accessoriesCost += ACCESSORY_RULES.cerminBevel.price;
  }
  if (additionalAccessories.stopKontakPopUp) {
    accessoriesCost += ACCESSORY_RULES.stopKontakPopUp.price;
  }
  if (additionalAccessories.rakPiringStainless) {
    accessoriesCost += ACCESSORY_RULES.rakPiringStainless.price;
  }

  // Unit price
  const unitPrice = Math.round(
    furnitureBaseCost +
      materialCost * 0.4 +
      finishingCost * 0.5 +
      hardwareCost * 0.6 +
      accessoriesCost
  );

  const totalPrice = unitPrice * Math.max(1, quantity);

  // Estimated production days
  const estimatedDays = Math.max(7, Math.round(10 + meterEquivalent * 2));

  return {
    baseRatePerUnit: baseRate,
    meterEquivalent: Number(meterEquivalent.toFixed(2)),
    furnitureBaseCost,
    materialCost,
    finishingCost,
    hardwareCost,
    accessoriesCost,
    unitPrice,
    totalPrice,
    marginPercent: 28, // Healthy workshop gross margin
    estimatedDays
  };
}
