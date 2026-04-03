import * as recordService from '../services/record.service.js';
import { createRecordSchema } from '../validations/record.validation.js';

export const create = async (req,res,next) => {
  try {
    const validated = createRecordSchema.parse(req.body);
    const userId = req.user.id;
    const record = await recordService.createRecord(userId, validated);
    res.status(201).json({ message: 'Success', record });
  } 
  catch(error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSummary = async (req,res,next) => {
  try {
    const summary = await recordService.getDashboardSummary();
    res.status(200).json({ message: 'Success', summary });
  } 
  catch(error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req,res,next) => {
  try {
    const { page, limit, type, category, startDate, endDate } = req.query;
    const filters = { type, category, startDate, endDate };
    
    const result = await recordService.getRecords(
      filters,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
    
    res.status(200).json({ message: 'Success', ...result });
  } 
  catch(error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req,res,next) => {
  try {
    const validated = updateRecordSchema.parse(req.body);
    const { id } = req.params;
    const userId = req.user.id;
    
    const record = await recordService.updateRecord(id, userId, validated);
    
    res.status(200).json({ message: 'Success', record });
  } 
  catch(error) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req,res,next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    await recordService.deleteRecord(id, userId);
    
    res.status(200).json({ message: 'Record deleted successfully' });
  } 
  catch(error) {
    res.status(400).json({ error: error.message });
  }
};