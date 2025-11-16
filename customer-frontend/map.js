// Initialize map
const map = L.map('map').setView([23.78, 90.27], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

let driverMarker = null;

// Connect to HiveMQ public broker (WebSocket)
const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

client.on("connect", () => {
  console.log("Frontend connected to MQTT");
  // Subscribe driver location
  client.subscribe("drivers/drv_12345/location");
});

client.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());
  // console.log("Received driver data:", data);

  const lat = data.lat;
  const lng = data.lng;

  if (!driverMarker) {
    driverMarker = L.marker([lat, lng]).addTo(map);
  } else {
    driverMarker.setLatLng([lat, lng]);
  }

  map.panTo([lat, lng]);
});
