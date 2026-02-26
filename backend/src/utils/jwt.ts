import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET!;
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
    
    return jwt.sign({ id: userId }, secret, {
        expiresIn,
    });
};
