import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Orders, OrderStatus } from '../../models/orders'
import { Ticket } from '../../models/ticket'

it('returns an error if the ticket does not exist', async () => {
	const ticketId = mongoose.Types.ObjectId();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ticketId})
		.expect(404);
});

it('returns an error if the ticket is already reserved', async() => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20
	})
	await ticket.save()

	// Use manual approach

	// const order = Orders.build({
	// 	ticket,
	// 	userId: 'lll',
	// 	status: OrderStatus.Created,
	// 	expiresAt: new Date()
	// })

	// await order.save();

	// Use API for creating a ticket instead of creating manually

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ticketId: ticket.id})

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ticketId: ticket.id})
		.expect(400);
});

it('reserves a ticket', async() => {

	const ticket = Ticket.build({
		title: 'concert',
		price: 20
	})
	await ticket.save()

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ticketId: ticket.id})
		.expect(201)
});

it.todo('emits a order created event')