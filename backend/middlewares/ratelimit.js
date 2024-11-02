import rateLimit from 'express-rate-limit';

export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many subscription attempts. Please try again later.'
  }
});