import { Request, Response, NextFunction } from 'express';

/**
 * Input sanitization middleware
 * Strips potential XSS payloads from request body, query, and params
 */
const sanitizeString = (str: string): string => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key of Object.keys(obj)) {
            // Don't sanitize password fields (they get hashed anyway)
            if (key.toLowerCase().includes('password')) {
                sanitized[key] = obj[key];
            } else {
                sanitized[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }
    return obj;
};

export const sanitizeInput = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    next();
};
