const express = require('express');
const { DaprClient, DaprServer, CommunicationProtocolEnum } = require('@dapr/dapr');

const app = express();
app.use(express.json());
const port = 3000;

const client = new DaprClient({
  daprHost: 'localhost',
  daprPort: '3500',
  communicationProtocol: CommunicationProtocolEnum.HTTP
});

const DAPR_STORE_NAME = 'mongodb-outbox';
const PUBSUB_NAME = 'kafka-pubsub';
const PUBSUB_TOPIC = 'new-order';

app.post('/orders', async (req, res) => {
  try {
    const order = req.body;

    // Định nghĩa thao tác lưu đơn hàng vào MongoDB
    const op1 = {
      operation: 'upsert',
      request: {
        key: order.orderId,
        value: order
      }
    };

    // Định nghĩa thao tác gửi thông báo với outbox.projection
    const op2 = {
      operation: 'upsert',
      request: {
        key: order.orderId,
        value: { orderId: order.orderId, status: 'created' },
        metadata: { 'outbox.projection': 'true' }
      }
    };

    // Thực hiện giao dịch
    await client.state.transaction(DAPR_STORE_NAME, [op1, op2]);

    res.status(200).json({ message: 'Order created and notification sent', orderId: order.orderId });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

app.listen(port, () => {
  console.log(`Order Service listening at http://localhost:${port}`);
});