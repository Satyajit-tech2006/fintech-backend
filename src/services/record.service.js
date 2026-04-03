import prisma from '../config/db.js';

export const createRecord = async (userId, data) => {
  return await prisma.$transaction(async (tx) => {
    const record = await tx.financialRecord.create({
      data: {
        ...data,
        createdBy: userId
      }
    });

    await tx.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'FINANCIAL_RECORD',
        userId,
        entityId: record.id,
        changes: data
      }
    });

    return record;
  });
};

export const getDashboardSummary = async () => {
  const records = await prisma.financialRecord.findMany({
    where: {
      deletedAt: null
    }
  });

  const summary = records.reduce((acc, record) => {
    const amount = parseFloat(record.amount);
    
    if (record.type === 'INCOME') {
      acc.totalIncome += amount;
      acc.netBalance += amount;
    } else {
      acc.totalExpenses += amount;
      acc.netBalance -= amount;
    }
    
    return acc;
  }, { totalIncome: 0, totalExpenses: 0, netBalance: 0 });

  return summary;
};