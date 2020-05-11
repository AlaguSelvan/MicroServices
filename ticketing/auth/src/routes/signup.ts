import express, {Request, Response} from 'express'
import { body, validationResult } from 'express-validator'
import { User } from '../models/User';
import { RequestValidationError, BadRequestError } from '@sftickets/common';
import jwt from 'jsonwebtoken'

const router = express.Router()

interface signupParams {
  email: string;
  password: string
}

router.post('/api/users/signup',
[
  body('email').isEmail(),
  body('password').trim().isLength({min: 4, max: 20})
  .withMessage('Password must be between 4 and 20 characters')
], async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email in use');
  }
  
  const user = User.build({email, password})
  
  await user.save();

  // Generate Jwt
  const userJwt = jwt.sign({
    id: user.id,
    email: user.email
  }, process.env.JWT_KEY!);

  // Store it on Session Object
  req.session = {
    jwt: userJwt,
  };
  res.status(201).send(user)
});

export { router as signupRouter };