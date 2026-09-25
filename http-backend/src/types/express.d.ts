// src/types/express.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;  // Add your custom properties here
      userRole?: string; 
    }
  }
}
