// writer.js
import fetch from "node-fetch";

const DAPR_PORT = 3500;
const STORE = "statestore";

async function writeInitialState() {
  const url = `http://localhost:${DAPR_PORT}/v1.0/state/${STORE}`;
  const body = [
    {
      key: "order-123",
      value: { status: "pending", amount: 500000 }
    }
  ];
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  console.log("Initial state written!");
}

await writeInitialState();
