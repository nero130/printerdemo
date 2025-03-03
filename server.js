const express = require("express");
const cors = require("cors");
const escpos = require("escpos");

escpos.USB = require("escpos-usb");
escpos.Bluetooth = require("escpos-bluetooth");

const app = express();
app.use(cors());
app.use(express.json());

// Detectar impresoras USB
app.get("/printers", async (req, res) => {
  try {
    const device = new escpos.USB();
    res.json({ message: "Impresora detectada", status: "OK" });
  } catch (error) {
    res.status(500).json({ error: "No se encontró impresora USB" });
  }
});

// Imprimir en impresora térmica
app.post("/print", async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Texto vacío" });

  try {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    device.open((err) => {
      if (err) return res.status(500).json({ error: "Error abriendo impresora" });

      printer
        .text(text)
        .cut()
        .close();
      
      res.json({ message: "Impresión enviada" });
    });
  } catch (error) {
    res.status(500).json({ error: "Error al imprimir" });
  }
});

app.listen(3001, () => console.log("Servidor corriendo en Termux en el puerto 3001"));
