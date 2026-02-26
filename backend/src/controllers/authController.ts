import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/auth';
import { NotificationService } from '../utils/notificationService';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password, role, phoneNumber } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already exists' });
        }

        if (phoneNumber) {
            const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
            if (existingPhone) {
                return res.status(409).json({ success: false, message: 'Phone number already exists' });
            }
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'user',
                phoneNumber,
            },
            select: { id: true, email: true, role: true, phoneNumber: true, createdAt: true },
        });

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

        res.status(200).json({
            success: true,
            data: {
                user: { id: user.id, email: user.email, role: user.role },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user,
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { method, contact } = req.body;

        if (!contact) {
            return res.status(400).json({ success: false, message: 'Contact information is required' });
        }

        let user;
        if (method === 'email') {
            user = await prisma.user.findUnique({ where: { email: contact } });
        } else if (method === 'sms') {
            user = await prisma.user.findUnique({ where: { phoneNumber: contact } });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid method' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate reset token (for email links) and code (for SMS)
        const resetToken = generateToken(user.id); // For email links
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // For SMS
        const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Store both in database
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                resetCode, 
                resetCodeExpires,
                // You could also store the resetToken if needed for verification
            }
        });

        // Send reset information based on method
        if (method === 'email') {
            // For email: create a reset link
            const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(contact)}`;
            
            // Send actual email notification
            await NotificationService.sendPasswordResetEmail(contact, resetLink, resetCode);
            
            // Also log for development
            console.log(`[EMAIL RESET SENT] To: ${contact}`);
            console.log(`[RESET LINK]: ${resetLink}`);
            console.log(`[RESET CODE]: ${resetCode}`);
            
        } else if (method === 'sms') {
            // Send actual SMS notification
            await NotificationService.sendPasswordResetSMS(contact, resetCode);
            
            // Also log for development
            console.log(`[SMS RESET SENT] To: ${contact}`);
            console.log(`[RESET CODE]: ${resetCode}`);
        }

        res.status(200).json({ 
            success: true, 
            message: method === 'email' 
                ? 'Reset link sent to your email' 
                : 'Reset code sent to your phone',
            // Include reset token in response for frontend testing (remove in production)
            resetToken: method === 'email' ? resetToken : undefined,
            resetCode: method === 'sms' ? resetCode : undefined
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { code, token, email, newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ success: false, message: 'New password is required' });
        }

        if (!code && !token) {
            return res.status(400).json({ success: false, message: 'Code or token is required' });
        }

        let user;

        if (token && email) {
            // Handle email token verification
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
                user = await prisma.user.findUnique({ where: { id: decoded.userId } });
                
                if (!user || user.email !== email) {
                    return res.status(400).json({ success: false, message: 'Invalid reset token' });
                }
            } catch (jwtError) {
                return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
            }
        } else if (code) {
            // Handle SMS code verification
            user = await prisma.user.findFirst({
                where: {
                    resetCode: code,
                    resetCodeExpires: { gt: new Date() }
                }
            });

            if (!user) {
                return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Either code or token+email is required' });
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetCode: null,
                resetCodeExpires: null
            }
        });

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        next(error);
    }
};
