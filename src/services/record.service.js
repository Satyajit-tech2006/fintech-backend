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
  const aggregations = await prisma.financialRecord.aggregate({
    where: { deletedAt: null },
    _sum: { amount: true },
    _avg: { amount: true },
    _count: { id: true }
  });

  const categoryTotals = await prisma.financialRecord.groupBy({
    by: ['category'],
    where: { deletedAt: null },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } }
  });

  const records = await prisma.financialRecord.findMany({
    where: { deletedAt: null },
    select: { amount: true, date: true, type: true },
    orderBy: { date: 'asc' }
  });

  const trends = records.reduce((acc, curr) => {
    const month = curr.date.toLocaleString('default', { month: 'short' });
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    
    if (curr.type === 'INCOME') acc[month].income += parseFloat(curr.amount);
    else acc[month].expense += parseFloat(curr.amount);
    
    return acc;
  }, {});

  return {
    stats: aggregations,
    categories: categoryTotals,
    trends
  };
};

export const getRecords = async (filters, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const whereClause = { deletedAt: null };
  
  if (filters.type) whereClause.type = filters.type;
  if (filters.category) whereClause.category = filters.category;
  
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.trim();
    if (searchTerm.length > 100) {
      throw new Error('Search term is too long.');
    }
    whereClause.OR = [
      { notes: { contains: searchTerm, mode: 'insensitive' } },
      { category: { contains: searchTerm, mode: 'insensitive' } }
    ];
  }
  
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