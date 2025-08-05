// concurrent-update.js
import fetch from "node-fetch";

const DAPR_PORT = 3500;
const STORE = "statestore";
const KEY = "order-123";

async function getStateWithETag() {
  const res = await fetch(`http://localhost:${DAPR_PORT}/v1.0/state/${STORE}/${KEY}`, {
    headers: { "Metadata": "true" }
  });
  return { data: await res.json(), etag: res.headers.get("ETag") };
}

async function updateStateWithETag(etag, newValue, serviceName) {
  const url = `http://localhost:${DAPR_PORT}/v1.0/state/${STORE}`;
  const body = [
    {
      key: KEY,
      value: newValue,
      etag,
      options: { concurrency: "first-write" }
    }
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (res.status === 204) {
    console.log(`${serviceName}: Update thành công!`);
  } else {
    console.log(`${serviceName}: Conflict! Không update được.`);
  }
}

(async () => {
  // Cả 2 service đọc cùng lúc
  const { etag } = await getStateWithETag();

  // Service A update trước
  await updateStateWithETag(etag, { status: "approved" }, "Service A");

  // Service B update với etag cũ -> fail
  await updateStateWithETag(etag, { status: "rejected" }, "Service B");
})();
