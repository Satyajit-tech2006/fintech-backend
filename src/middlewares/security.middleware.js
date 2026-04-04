import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

// 1. Global Security Headers (Blocks XSS, Clickjacking, MIME-sniffing)
export const securityHeaders = helmet();

// 2. Cross-Origin Resource Sharing (Locks down who can call your API)
// In production, you would change origin to ['https://yourfrontend.com']
export const corsConfig = cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
});

// 3. HTTP Parameter Pollution Protection
// Prevents attackers from sending duplicate query strings (e.g. ?amount=10&amount=5000)
export const parameterPollution = hpp();

// 4. Global Rate Limiter (Protects against DDOS)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 5. Auth-Specific Rate Limiter (Protects against Brute Force & Credential Stuffing)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Hour
  max: 1000, 
  message: { error: 'Too many authentication attempts.' },
  standardHeaders: true,
  legacyHeaders: false,
});
