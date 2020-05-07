import express, {Request, Response} from 'express'
import { body, validationResult } from 'express-validator'
import { User } from '../models/User';
import { RequestValidationError } from '../errors/request-validation-error'

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

  const existingUser = await User.findOne({ email: 'test@test.com' });
  console.log({existingUser})
  if(existingUser) {
    console.log('email in use')
    return res.send({})
  }
  const user = User.build({email, password})
  await user.save
  res.status(201).send(user)
});

export { router as signupRouter };