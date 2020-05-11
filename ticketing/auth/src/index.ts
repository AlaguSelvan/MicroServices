import mongoose from 'mongoose'
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('No Secret Found');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  } catch (err) {
    console.error(err)
  }
  app.listen(3000, () => {
    console.log('Auth Listening on 3000!!')
  })
}

start();
