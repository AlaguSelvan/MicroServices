import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', async() => {
  console.log(process.env.JWT_KEY!)
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@gmail.com',
      password: 'password'
    })
    .expect(201)
})