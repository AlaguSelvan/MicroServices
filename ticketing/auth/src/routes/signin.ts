import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/User'
import { RequestValidationError } from '@sftickets/common';
import { validateRequest } from '@sftickets/common';
import { BadRequestError } from '@sftickets/common';
import { Password } from '../services/password';

const router = express.Router()

router.post('/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must enter a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError('Invalid credentials')
    const passwordsMatch = await Password.compare(existingUser.password, password)
    if(!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials')
    }

    // Generate Jwt
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);

    // Store it on Session Object
    req.session = {
      jwt: userJwt
    };

    res.status(200).send(existingUser)
  }
);

export { router as signinRouter };