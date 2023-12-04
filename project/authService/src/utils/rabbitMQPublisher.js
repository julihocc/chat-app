const amqp = require('amqplib');
const {debug} = require("./logger");

const RABBITMQ_URL = process.env.RABBITMQ_URL;
debug(`Connecting to RabbitMQ at ${RABBITMQ_URL}`);

async function publishUserEvent(queue, eventType, userData) {
    debug(`Connecting to RabbitMQ at ${RABBITMQ_URL}`);
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    const eventMessage = JSON.stringify({ eventType, userData });
    channel.sendToQueue(queue, Buffer.from(eventMessage), { persistent: true });

    console.log(`Published ${eventType} event to ${queue} queue`);
    await channel.close();
    await connection.close();
}

module.exports = { publishUserEvent };
