import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@sftickets/common';
import { Orders } from '../models/orders';
import { OrderCancelledEventPublisher } from '../events/publisher/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
	const {orderId} = req.params

	const order = await Orders.findById(orderId).populate('ticket')

	if (!order) throw new NotFoundError();

	if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

	order.status = OrderStatus.Cancelled
	await order.save()

	new OrderCancelledEventPublisher(natsWrapper.client).publish({
		id: orderId,
		ticket: {
			id: order.ticket.id
		}
	})

	res.status(204).send(order);
});

export { router as deleteOrderRouter };
