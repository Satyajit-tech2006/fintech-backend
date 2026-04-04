import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

export const securityHeaders = helmet();

export const corsConfig = cors({
  origin: process.env.CORS_ORIGIN || '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
});

export const parameterPollution = hpp();

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many authentication attempts. Your IP is locked for 1 hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});