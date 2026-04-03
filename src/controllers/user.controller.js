import * as userService from '../services/user.service.js';
import { updateRoleSchema, updateStatusSchema } from '../validations/user.validation.js';

export const getAll = async (req,res,next) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ message: 'Success', users });
  } 
  catch(error) {
    res.status(500).json({ error: error.message });
  }
};

export const changeRole = async (req,res,next) => {
  try {
    const validated = updateRoleSchema.parse(req.body);
    const { id } = req.params;
    
    // Optional: Prevent Admin from demoting themselves
    if (req.user.id === id) {
      return res.status(403).json({ error: 'You cannot change your own role' });
    }
    
    const user = await userService.updateUserRole(id, validated.role);
    res.status(200).json({ message: 'Role updated successfully', user });
  } 
  catch(error) {
    res.status(400).json({ error: error.message });
  }
};

export const changeStatus = async (req,res,next) => {
  try {
    const validated = updateStatusSchema.parse(req.body);
    const { id } = req.params;
    
    // Optional: Prevent Admin from deactivating themselves
    if (req.user.id === id) {
      return res.status(403).json({ error: 'You cannot deactivate your own account' });
    }

    const user = await userService.updateUserStatus(id, validated.status);
    res.status(200).json({ message: 'Status updated successfully', user });
  } 
  catch(error) {
    res.status(400).json({ error: error.message });
  }
};