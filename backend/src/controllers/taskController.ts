import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middlewares/auth';

export const getTasks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const where = req.user!.role === 'admin' ? {} : { userId: req.user!.id };
        const tasks = await prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true } } } // Include user info for admin visibility
        });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};

export const getTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id },
            include: { user: { select: { email: true } } }
        });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Role check: Only owner or admin can view
        if (task.userId !== req.user!.id && req.user!.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const createTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, description } = req.body;
        const task = await prisma.task.create({
            data: {
                title,
                description,
                userId: req.user!.id,
            },
        });
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Role check: Only owner or admin can update
        if (task.userId !== req.user!.id && req.user!.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const updated = await prisma.task.update({
            where: { id },
            data: { title, description, completed },
            include: { user: { select: { email: true } } }
        });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Role check: Only owner or admin can delete
        if (task.userId !== req.user!.id && req.user!.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        await prisma.task.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
};
