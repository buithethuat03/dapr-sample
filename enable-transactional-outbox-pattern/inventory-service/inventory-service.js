const { DaprServer } = require('@dapr/dapr');

const server = new DaprServer({
  daprHost: 'localhost',
  daprPort: '3500',
  communicationProtocol: CommunicationProtocolEnum.HTTP
});

const PUBSUB_NAME = 'kafka-pubsub';
const PUBSUB_TOPIC = 'new-order';

async function start() {
  // Đăng ký subscriber cho topic new-order
  await server.pubsub.subscribe(PUBSUB_NAME, PUBSUB_TOPIC, async (data) => {
    console.log('Received new order:', data);
    // Xử lý logic kiểm tra/giữ chỗ hàng tồn kho
    console.log(`Processing inventory for order ${data.orderId}`);
    // Ví dụ: Gọi hàm xử lý kho
    // await updateInventory(data.orderId);
  });

  // Khởi động server
  await server.start();
  console.log('Inventory Service started and subscribed to new-order topic');
}

start().catch((error) => {
  console.error('Error starting Inventory Service:', error);
});