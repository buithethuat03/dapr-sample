import { DaprClient, CommunicationProtocolEnum } from "@dapr/dapr";

const daprHost = "127.0.0.1";          // Dapr sidecar host
const daprPort = process.env.DAPR_HTTP_PORT || "3500"; // Port mặc định
const STATE_STORE_NAME = "statestore"; // Redis mặc định

// Sleep helper
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function start(orderId) {
  const client = new DaprClient({
    daprHost,
    daprPort,
    communicationProtocol: CommunicationProtocolEnum.HTTP,
  });

  // 1. Save state
  await client.state.save(STATE_STORE_NAME, [
    { key: "order_1", value: orderId.toString() },
    { key: "order_2", value: orderId.toString() },
  ]);
  console.log(`Saved order_1 & order_2 with value ${orderId}`);

  // 2. Get state
  const result = await client.state.get(STATE_STORE_NAME, "order_1");
  console.log("Result after get: " + result);

  // 3. Delete state
  await client.state.delete(STATE_STORE_NAME, "order_1");
  console.log("Deleted order_1");
}

async function main() {
  for (let i = 0; i < 3; i++) {
    const orderId = Math.floor(Math.random() * (1000 - 1) + 1);
    await start(orderId);
    await sleep(3000);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
