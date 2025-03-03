const express = require("express");
const cors = require("cors");
const printer = require("node-printer");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/printers", (req, res) => {
  try {
    const printers = printer.getPrinters(); // Obtener lista de impresoras
    res.json(printers);
  } catch (error) {
    console.error("Error obteniendo impresoras:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log("Servidor de impresión en http://localhost:3001"));
