import * as authService from '../services/auth.service.js';
import {registerSchema,loginSchema} from '../validations/auth.validation.js';

export const register = async (req,res,next) => {
  try {
    const validated = registerSchema.parse(req.body);
    const user = await authService.registerUser(validated);
    res.status(201).json({message:'Success',user });
  } 
  catch(error) {
    res.status(400).json({error:error.message });
  }
};

export const login = async (req,res,next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const { user, token } = await authService.loginUser(validated.email, validated.password);
    res.status(200).json({ message:'Success',token,user });
  } 
  catch(error) {
    res.status(401).json({error:error.message });
  }
};