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