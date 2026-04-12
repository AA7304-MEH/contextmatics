import Replicate from 'replicate';
// Replicate client initialization
// Note: Verification of token is now handled inside the services to prevent build-time crashes.

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export default replicate;
