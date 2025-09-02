
import { TIER1_COUNTRIES, PRICING_TIERS } from '../constants';
import type { TierId, PricingTier } from '../types';

export const getPricingTierId = (countryCode: string): TierId => {
    if (TIER1_COUNTRIES.includes(countryCode.toUpperCase())) {
        return 'tier1';
    }
    return 'tier2';
};

export const getUserPricing = (countryCode: string): PricingTier => {
    const tierId = getPricingTierId(countryCode);
    return PRICING_TIERS[tierId];
};
