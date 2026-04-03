import prisma from '../config/db.js';

export const getUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateUserRole = async (userId, newRole) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: { id: true, name: true, email: true, role: true }
  });
};

export const updateUserStatus = async (userId, newStatus) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
    select: { id: true, name: true, email: true, status: true }
  });
};