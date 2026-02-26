import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (validations: any[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    };
};

// Auth validations
export const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
];

export const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Task validations
export const taskValidation = [
    body('title').notEmpty().trim().isLength({ max: 100 }).withMessage('Title is required and must be under 100 chars'),
    body('description').optional().trim(),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
];
