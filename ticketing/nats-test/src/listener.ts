import nats, { Message, Stan, SubscriptionOptions } from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { Listener } from './events/base-listener';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');
  stan.on('close', () => {
    console.log('NATS connection closed!')
    process.exit();
  })
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName('deliver-service');
  // const subscription = stan.subscribe('ticket:created', 'queue-group-name', options);

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData()

  //   if (typeof data === 'string') {
  //     console.log(`Received event #${msg.getSequence()}, with data:${data}`);
  //   }

  //   msg.ack();
  // });
  new TicketCreatedListener(stan).listen();
});

// interrupt signals
process.on('SIGINT', () => stan.close());
// terminate signals
process.on('SIGTERM', () => stan.close());
