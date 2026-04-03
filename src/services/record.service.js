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

export const getRecords = async (filters, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const whereClause = { deletedAt: null };
  
  if (filters.type) whereClause.type = filters.type;
  if (filters.category) whereClause.category = filters.category;
  
  if (filters.startDate || filters.endDate) {
    whereClause.date = {};
    if (filters.startDate) whereClause.date.gte = new Date(filters.startDate);
    if (filters.endDate) whereClause.date.lte = new Date(filters.endDate);
  }

  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { date: 'desc' }
    }),
    prisma.financialRecord.count({ where: whereClause })
  ]);

  return {
    records,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

export const updateRecord = async (id, userId, data) => {
  return await prisma.$transaction(async (tx) => {
    const record = await tx.financialRecord.update({
      where: { id },
      data
    });

    await tx.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'FINANCIAL_RECORD',
        userId,
        entityId: record.id,
        changes: data
      }
    });

    return record;
  });
};

export const deleteRecord = async (id, userId) => {
  return await prisma.$transaction(async (tx) => {
    const record = await tx.financialRecord.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    await tx.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'FINANCIAL_RECORD',
        userId,
        entityId: record.id,
        changes: { status: 'DELETED' }
      }
    });

    return record;
  });
};