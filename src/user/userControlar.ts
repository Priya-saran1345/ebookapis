// userControlar.ts
import { Request, Response, NextFunction } from 'express';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    // Add your logic to save user to DB here

    return res.status(201).json({ message: 'User created', user: { username, email ,password } });
  } catch (error) {
    next(error); // Forward error to global handler
  }
};
