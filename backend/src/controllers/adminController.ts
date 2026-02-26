import { Response, NextFunction } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middlewares/auth';

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Forbidden - Admin only
 */
export const getAllUsers = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                phoneNumber: true,
                createdAt: true,
                _count: { select: { tasks: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
export const deleteUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        // Prevent self-deletion
        if (id === req.user!.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account',
            });
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await prisma.user.delete({ where: { id } });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get platform statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform stats
 */
export const getStats = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const [userCount, taskCount, completedTasks] = await Promise.all([
            prisma.user.count(),
            prisma.task.count(),
            prisma.task.count({ where: { completed: true } }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers: userCount,
                totalTasks: taskCount,
                completedTasks,
                pendingTasks: taskCount - completedTasks,
                completionRate: taskCount > 0
                    ? Math.round((completedTasks / taskCount) * 100)
                    : 0,
            },
        });
    } catch (error) {
        next(error);
    }
};
