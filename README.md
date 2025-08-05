Dapr Sample
Hướng dẫn cài đặt, khởi tạo và sử dụng Dapr để quản lý trạng thái (State Management) trong ứng dụng.
1. Cài đặt và khởi tạo dự án Dapr
1.1. Cài đặt Dapr từ terminal
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash

1.2. Xác minh cài đặt
dapr -h

1.3. Cài Dapr runtime
dapr init
docker ps

Output: Các container được tạo liên quan đến Dapr.
1.4. Kiểm tra phiên bản Dapr
dapr --version

1.5. Xác minh components directory được khởi tạo
ls $HOME/.dapr

Output: bin components config.yaml
2. State Management

Ngôn ngữ: JavaScript (Node.js)
Lưu trữ: Redis (mặc định của Dapr)

2.1. Save, Get & Delete State
Mục đích: Thực hiện các thao tác cơ bản với state: lưu, đọc và xóa dữ liệu thông qua Dapr.
Tạo dự án mới với Node.js:
npm init -y
npm install @dapr/dapr

Code: ./get-save-delete state/index.ts
Output:
thuat03@thuat03:~/Documents/VSCode/dapr-sample/get-save-delete state$ dapr run --app-id orderprocessing --app-port 6001 --dapr-http-port 3601 --dapr-grpc-port 60001 node index.js
...
== APP == 
== APP == > dapr-sample@1.0.0 start
== APP == > node index.js
== APP == 
== APP == (node:58581) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/thuat03/Documents/VSCode/dapr-sample/index.js is not specified and it doesn't parse as CommonJS.
== APP == Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
== APP == To eliminate this warning, add "type": "module" to /home/thuat03/Documents/VSCode/dapr-sample/package.json.
== APP == (Use `node --trace-warnings ...` to show where the warning was created)
== APP == 2025-08-04T09:43:10.148Z INFO [HTTPClient, HTTPClient] Sidecar Started
== APP == Saved order_1 & order_2 with value 915
== APP == Result after get: 915
== APP == Deleted order_1
ℹ️  Updating metadata for appPID: 58556
ℹ️  Updating metadata for app command: npm start
✅  You're up and running! Both Dapr and your app logs will appear here.

== APP == 2025-08-04T09:43:13.161Z INFO [HTTPClient, HTTPClient] Sidecar Started
== APP == Saved order_1 & order_2 with value 654
== APP == Result after get: 654
== APP == Deleted order_1
== APP == 2025-08-04T09:43:16.175Z INFO [HTTPClient, HTTPClient] Sidecar Started
== APP == Saved order_1 & order_2 with value 257
== APP == Result after get: 257
== APP == Deleted order_1
✅  Exited App successfully
ℹ️  
terminated signal received: shutting down
✅  Exited Dapr successfully

2.2. State TTL
Mục đích: Lưu dữ liệu có thời gian sống giới hạn (hết hạn sẽ tự xóa), phù hợp cho OTP, session, cache tạm thời.
Code: ./ttl/index.ts
Output:
thuat03@thuat03:~/Documents/VSCode/dapr-sample/ttl$ dapr run --app-id orderprocessing --app-port 6001 --dapr-http-port 3601 --dapr-grpc-port 60001 node index.js
...
== APP == 
== APP == > ttl@1.0.0 start
== APP == > node index.js
== APP == 
== APP == (node:63189) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/thuat03/Documents/VSCode/dapr-sample/ttl/index.js is not specified and it doesn't parse as CommonJS.
== APP == Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
== APP == To eliminate this warning, add "type": "module" to /home/thuat03/Documents/VSCode/dapr-sample/ttl/package.json.
== APP == (Use `node --trace-warnings ...` to show where the warning was created)
== APP == 2025-08-04T09:52:55.250Z INFO [HTTPClient, HTTPClient] Sidecar Started
== APP == Saved OTP with TTL 10s
== APP == Immediately get: 123456
ℹ️  Updating metadata for appPID: 63164
ℹ️  Updating metadata for app command: npm start
✅  You're up and running! Both Dapr and your app logs will appear here.

== APP == After 12s: 
✅  Exited App successfully
ℹ️  
terminated signal received: shutting down
✅  Exited Dapr successfully

2.3. Share State Between Apps
Mục đích: Cho phép nhiều service/app cùng đọc và ghi chung một state store, giúp chia sẻ dữ liệu mà không cần gọi trực tiếp giữa các service.
Code:

Service 1: ./share-state-between-apps/save.js (lưu dữ liệu)
Service 2: ./share-state-between-apps/read.js (đọc dữ liệu)

Output:
Service 1:
thuat03@thuat03:~/Documents/VSCode/dapr-sample/share-state-between-apps$ dapr run --app-id service-a node save.js
...
== APP == (node:67110) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/thuat03/Documents/VSCode/dapr-sample/share-state-between-apps/save.js is not specified and it doesn't parse as CommonJS.
== APP == Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
== APP == To eliminate this warning, add "type": "module" to /home/thuat03/Documents/VSCode/dapr-sample/share-state-between-apps/package.json.
== APP == (Use `node --trace-warnings ...` to show where the warning was created)
== APP == 2025-08-04T10:04:05.958Z INFO [HTTPClient, HTTPClient] Sidecar Started
== APP == Service A: Saved cart for user123: [ 'productA', 'productB' ]
✅  Exited App successfully
ℹ️  
terminated signal received: shutting down
✅  Exited Dapr successfully

Service 2:
thuat03@thuat03:~/Documents/VSCode/dapr-sample/share-state-between-apps$ dapr run --app-id service-a node read.js
...
== APP == (node:67793) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/thuat03/Documents/VSCode/dapr-sample/share-state-between-apps/read.js is not specified and it doesn't parse as CommonJS.
== APP == Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
== APP == To eliminate this warning, add "type": "module" to /home/thuat03/Documents/VSCode/dapr-sample/share-state-between-apps/package.json.
== APP == (Use `node --trace-warnings ...` to show where the warning was created)
== APP == 2025-08-04T10:05:50.958Z INFO [HTTPClient, HTTPClient] Sidecar Started
== APP == Service B: Read cart for user123: [ 'productA', 'productB' ]
✅  Exited App successfully
ℹ️  
terminated signal received: shutting down
✅  Exited Dapr successfully

Cơ chế xử lý xung đột khi nhiều service cùng ghi: Etag + Concurrency Policy
Cách dùng cơ bản:

Ghi state: ./share-state-between-apps/writer.js
Đọc state kèm Etag: ./share-state-between-apps/etag.js

Mỗi khi update state thành công, giá trị Etag sẽ thay đổi.
Chính sách ghi:

First-write: Ai ghi trước thắng, người sau bị từ chối nếu Etag sai.
Last-write: Ai ghi sau thắng (ghi đè).

Ví dụ: Minh họa cho việc 2 service cùng đọc và update một state, nhưng vì service A update trước (thành công) dẫn đến Etag thay đổi, lúc này service B update state sau bằng giá trị Etag cũ nên bị từ chối.
Output:
== APP == Service A: Update thành công!
== APP == Service B: Conflict! Không update được.

2.4. Query State
Lợi ích: Dapr đóng vai trò trung gian giữa service và DB. Service không cần biết DB là loại gì (MongoDB, PostgreSQL, CosmosDB, …), chỉ cần gửi truy vấn theo định dạng JSON DSL của Dapr. Dapr sẽ dịch truy vấn đó sang câu lệnh phù hợp với DB backend và trả về kết quả JSON.
Cách dùng: Gửi request qua HTTP hoặc gRPC. Body của request gồm 3 phần chính:

filter: Điều kiện lọc.
sort: Sắp xếp.
page: Phân trang.

Chi tiết: https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-state-query-api/
2.5. Build a Stateful Service
Mục đích: Một ứng dụng duy nhất nhưng được scale ra nhiều instance.
Mục tiêu: Đồng bộ trạng thái giữa các instance để service hoạt động như một thể thống nhất.
Code: ./build-a-stateful-service
Run code:
thuat03@thuat03:~/Documents/VSCode/dapr-sample/build-a-stateful-service$ dapr run --app-id state-service --app-port 3000 --dapr-http-port 3500 node index.js

Test API:

Save:thuat03@thuat03:~$ curl -X POST http://localhost:3000/state/user1 -H "Content-Type: application/json" -d '{"value":"Hello Dapr"}'
{"message":"Saved key=user1","value":"Hello Dapr"}


Get:thuat03@thuat03:~$ curl http://localhost:3000/state/user1
{"key":"user1","value":"Hello Dapr"}


Delete:thuat03@thuat03:~$ curl -X DELETE http://localhost:3000/state/user1
{"message":"Deleted key=user1"}



Cơ chế (giống với Share State Between Apps):

Last-write-wins (mặc định): Ai ghi cuối cùng thì dữ liệu theo người đó. Dễ bị ghi đè khi nhiều instance update cùng lúc.
First-write-wins (dùng ETag):
Mỗi bản ghi có ETag (version).
Khi update, bạn phải gửi kèm ETag hiện tại.
Nếu trong lúc đó có instance khác đã update (ETag đổi) → update fail (409 Conflict) → bạn có thể retry hoặc xử lý khác.
Lợi ích: Giải quyết race condition (2 instance cùng cộng điểm → không bị mất dữ liệu).



2.6. How to: Enable the Transactional Outbox Pattern
Mô tả: Thay vì để service vừa ghi dữ liệu vừa tự publish event vào message queue (Kafka, RabbitMQ, …), Dapr cho phép bạn kết hợp thao tác lưu state và publish event trong một transaction duy nhất.
Luồng ví dụ:
User → Order Service (Service A) → Dapr → MongoDB
                                     ↓
                                   Kafka (topic: OrderCreated)
                                     ↓
        ┌────────────────────────────┴───────────────────────────┐
        ↓                                                        ↓
Inventory Service (Service B)                     Notification Service (Service C)
Update stock                                     Send confirmation email

Các trường hợp:

Chỉ ghi state: Thao tác với state store qua Dapr như bình thường. (Xem #2.1)
Ghi state + publish event: Sau khi ghi state, yêu cầu Dapr tự động publish event.
Ghi state + publish event (customize event): Giống trường hợp 2, nhưng ghi đè một số field trong event trước khi Dapr publish.

Cấu hình:Để sử dụng Outbox, cần thêm các component config, ví dụ:

mongodb-outbox.yaml (state store outbox)
kafka-pubsub.yaml (pub/sub)

Chạy lệnh:
dapr run --app-id state-service --app-port 3000 --components-path ./components --dapr-http-port 3500 node index.js

Chi tiết: https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-outbox/
2.7. Encrypt State (Mã hóa state)
Mô tả: Bảo vệ dữ liệu trong state store bằng các thuật toán mã hóa. Khi thao tác với Dapr API, dữ liệu sẽ được mã hóa trước khi lưu và được tự động giải mã khi đọc.
Các bước:

Tạo secret key:
openssl rand 16 | hexdump -v -e '/1 "%02x"'

Kết quả: Giống như cb321007ad11a9d23f963bff600d58e0
Lưu vào: ./encrypt-state/app-secret.json

Tạo secret store:
./encrypt-state/components/local-secret-store.yaml


Cấu hình state store với encryption:
./encrypt-state/components/statestore.yaml


Chuẩn bị service:
index.js


Chạy ứng dụng:
thuat03@thuat03:~/Documents/VSCode/dapr-sample/encrypt-state$ dapr run --app-id node-encrypt --components-path ./components --dapr-http-port 3500 node index.js

Output:
== APP == Saved via Dapr: user:encrypted status: 204
== APP == 
== APP == Raw response from Dapr: map[email:abc@gmail.com name:Encrypted Thuật]


Kiểm tra trong Redis:
thuat03@thuat03:~$ docker exec -it dapr_redis redis-cli
127.0.0.1:6379> keys *
1) "node-encrypt||user:encrypted"
127.0.0.1:6379> hgetall "node-encrypt||user:encrypted"
1) "data"
2) "WFFhHhpRQ3+ps3uFMo88p8Khraa84Chromebookuei84defTFxxoZ3aDQxkUCgdWQ+I6yzxRa74NfqiAb7MWpOTaOxSgagCrBpN6jy0w7E||mykey"
3) "version"
4) "1"
