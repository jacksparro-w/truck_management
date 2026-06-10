const io =
require("socket.io-client");

const socket =
io("http://localhost:5000");

socket.on(
  "truck:update",
  console.log
);

socket.on(
  "congestion:new",
  console.log
);