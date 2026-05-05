export interface Plan {
  id: string;
  name: string;
  priceINR: number;
  priceUSD: number;
  credits: number;
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    priceINR: 0,
    priceUSD: 0,
    credits: 5
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceINR: 599,
    priceUSD: 22,
    credits: 500
  },
  business: {
    id: 'business',
    name: 'Business',
    priceINR: 1499,
    priceUSD: 45,
    credits: 10000
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    priceINR: 16000, // Yearly approximation for validation safety
    priceUSD: 486,
    credits: 1000000
  }
};

export const getPlanByName = (name: string): Plan | undefined => {
  const norm = name.toLowerCase();
  return Object.values(PLANS).find(p => p.name.toLowerCase() === norm || p.id === norm);
};
