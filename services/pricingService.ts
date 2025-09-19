
import { TIER1_COUNTRIES, PRICING_TIERS } from '../constants';
import type { TierId, UserPricingInfo } from '../types';

export const getPricingTierId = (countryCode: string): TierId => {
    if (TIER1_COUNTRIES.includes(countryCode.toUpperCase())) {
        return 'tier1';
    }
    return 'tier2';
};

// A mock conversion rate for demonstration purposes. In a real app, this would come from a live API.
const USD_TO_INR_RATE = 83; 

export const getUserPricing = (countryCode: string): UserPricingInfo => {
    const tierId = getPricingTierId(countryCode);
    const usdPrices = PRICING_TIERS[tierId];

    if (countryCode.toUpperCase() === 'IN') {
        const convert = (usd: number) => Math.round(usd * USD_TO_INR_RATE);
        return {
            prices: {
                pro: {
                    monthly: convert(usdPrices.pro.monthly),
                    yearly: convert(usdPrices.pro.yearly),
                },
                business: {
                    monthly: convert(usdPrices.business.monthly),
                    yearly: convert(usdPrices.business.yearly),
                }
            },
            currency: 'INR',
            currencySymbol: '₹',
        };
    }
    
    return {
        prices: usdPrices,
        currency: 'USD',
        currencySymbol: '$',
    };
};