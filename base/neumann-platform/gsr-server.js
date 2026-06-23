<<<<<<< HEAD
const WebSocket = require("ws");
const mqtt = require("mqtt");

// Configurações
const MQTT_BROKER = "mqtt://broker.hivemq.com";
const WS_PORT = 8080;

// Conectar ao MQTT
const mqttClient = mqtt.connect(MQTT_BROKER);

// Criar servidor WebSocket
const wss = new WebSocket.Server({ port: WS_PORT });

console.log(`🚀 WebSocket Server rodando na porta ${WS_PORT}`);
console.log(`📡 Conectado ao MQTT Broker: ${MQTT_BROKER}`);

// Tópicos
const topics = {
  data: "neumann/gsr/lovelace/data",
  commands: "neumann/gsr/lovelace/commands",
};

// Clientes WebSocket conectados
const clients = new Set();

// WebSocket Connection
wss.on("connection", function connection(ws) {
  console.log("✅ Novo cliente WebSocket conectado");
  clients.add(ws);

  // Inscrever nos tópicos MQTT quando cliente conectar
  mqttClient.subscribe(topics.data, (err) => {
    if (!err) console.log(`📨 Inscrito no tópico: ${topics.data}`);
  });

  // Mensagens do WebSocket (comandos para ESP32)
  ws.on("message", function incoming(message) {
    console.log(`📤 Comando recebido: ${message}`);

    // Publicar comando no MQTT
    if (
      message.toString().includes("led_") ||
      message.toString().includes("get_data")
    ) {
      mqttClient.publish(topics.commands, message.toString());
      console.log(`📨 Comando publicado: ${message}`);
    }
  });

  ws.on("close", function close() {
    console.log("❌ Cliente WebSocket desconectado");
    clients.delete(ws);
  });

  ws.on("error", function error(err) {
    console.log("❌ Erro WebSocket:", err);
  });
});

// Mensagens MQTT (dados do ESP32)
mqttClient.on("message", function (topic, message) {
  console.log(`📨 MQTT Message [${topic}]: ${message.toString()}`);

  // Enviar para todos os clientes WebSocket
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });
});

mqttClient.on("connect", function () {
  console.log("✅ Conectado ao MQTT Broker");
});

mqttClient.on("error", function (err) {
  console.log("❌ Erro MQTT:", err);
});

// Manter servidor rodando
process.on("SIGINT", function () {
  console.log("\n🛑 Desligando servidor...");
  mqttClient.end();
  wss.close();
  process.exit();
});
=======
const WebSocket = require("ws");
const mqtt = require("mqtt");

// Configurações
const MQTT_BROKER = "mqtt://broker.hivemq.com";
const WS_PORT = 8080;

// Conectar ao MQTT
const mqttClient = mqtt.connect(MQTT_BROKER);

// Criar servidor WebSocket
const wss = new WebSocket.Server({ port: WS_PORT });

console.log(`🚀 WebSocket Server rodando na porta ${WS_PORT}`);
console.log(`📡 Conectado ao MQTT Broker: ${MQTT_BROKER}`);

// Tópicos
const topics = {
  data: "neumann/gsr/lovelace/data",
  commands: "neumann/gsr/lovelace/commands",
};

// Clientes WebSocket conectados
const clients = new Set();

// WebSocket Connection
wss.on("connection", function connection(ws) {
  console.log("✅ Novo cliente WebSocket conectado");
  clients.add(ws);

  // Inscrever nos tópicos MQTT quando cliente conectar
  mqttClient.subscribe(topics.data, (err) => {
    if (!err) console.log(`📨 Inscrito no tópico: ${topics.data}`);
  });

  // Mensagens do WebSocket (comandos para ESP32)
  ws.on("message", function incoming(message) {
    console.log(`📤 Comando recebido: ${message}`);

    // Publicar comando no MQTT
    if (
      message.toString().includes("led_") ||
      message.toString().includes("get_data")
    ) {
      mqttClient.publish(topics.commands, message.toString());
      console.log(`📨 Comando publicado: ${message}`);
    }
  });

  ws.on("close", function close() {
    console.log("❌ Cliente WebSocket desconectado");
    clients.delete(ws);
  });

  ws.on("error", function error(err) {
    console.log("❌ Erro WebSocket:", err);
  });
});

// Mensagens MQTT (dados do ESP32)
mqttClient.on("message", function (topic, message) {
  console.log(`📨 MQTT Message [${topic}]: ${message.toString()}`);

  // Enviar para todos os clientes WebSocket
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });
});

mqttClient.on("connect", function () {
  console.log("✅ Conectado ao MQTT Broker");
});

mqttClient.on("error", function (err) {
  console.log("❌ Erro MQTT:", err);
});

// Manter servidor rodando
process.on("SIGINT", function () {
  console.log("\n🛑 Desligando servidor...");
  mqttClient.end();
  wss.close();
  process.exit();
});
