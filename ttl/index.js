import { DaprClient, CommunicationProtocolEnum } from "@dapr/dapr";

const daprHost = "127.0.0.1";
const daprPort = process.env.DAPR_HTTP_PORT || "3500";
const STATE_STORE_NAME = "statestore";

async function main() {
  const client = new DaprClient({
    daprHost,
    daprPort,
    communicationProtocol: CommunicationProtocolEnum.HTTP,
  });

  // Save state with TTL = 10 seconds
  await client.state.save(STATE_STORE_NAME, [
    { 
      key: "otp:user123", 
      value: "123456",
      metadata: { ttlInSeconds: "10" }   // TTL: 10s
    },
  ]);
  console.log("Saved OTP with TTL 10s");

  // Get ngay
  let value = await client.state.get(STATE_STORE_NAME, "otp:user123");
  console.log("Immediately get:", value);

  // Đợi 12s
  await new Promise(r => setTimeout(r, 12000));

  // Get sau khi hết hạn
  value = await client.state.get(STATE_STORE_NAME, "otp:user123");
  console.log("After 12s:", value);
}

main();
