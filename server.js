const express = require("express");
const cors = require("cors");
const printer = require("node-printer");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

// Servidor WebSocket para comunicación en tiempo real
const wss = new WebSocket.Server({ port: 3002 });
wss.on("connection", ws => {
  console.log("Cliente WebSocket conectado");
  ws.send(JSON.stringify({ message: "Conectado al servidor de impresión" }));
});

// Obtener la lista de impresoras disponibles
app.get("/printers", (req, res) => {
  try {
    const printers = printer.getPrinters(); // Obtiene las impresoras disponibles
    console.log("Impresoras disponibles:", printers)
    res.json(printers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar datos a la impresora seleccionada
app.post("/print", (req, res) => {
  const { printerName, data } = req.body;

  if (!printerName || !data) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  try {
    const printJob = printer.printDirect({
      printer: printerName,
      data: data,
      type: "RAW",
      success: jobId => {
        res.json({ success: true, jobId });
        wss.clients.forEach(client => client.send(`Impresión enviada a ${printerName}`));
      },
      error: err => res.status(500).json({ error: err.message }),
    });

    console.log(`Trabajo de impresión enviado a ${printerName}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(3001, () => console.log("Servidor de impresión en http://localhost:3001"));
