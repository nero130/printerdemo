const express = require("express");
const cors = require("cors");
const printer = require("pdf-to-printer");

const app = express();
app.use(cors());
app.use(express.json());

// Obtener lista de impresoras disponibles
app.get("/printers", async (req, res) => {
  try {
    const printers = await printer.getPrinters();
    res.json(printers);
  } catch (error) {
    console.error("Error obteniendo impresoras:", error);
    res.status(500).json({ error: error.message });
  }
});

// Imprimir un archivo PDF en la impresora seleccionada
app.post("/print", async (req, res) => {
  const { printerName, filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: "Debe proporcionar un archivo PDF" });
  }

  try {
    await printer.print(filePath, { printer: printerName });
    res.json({ message: "Archivo enviado a la impresora correctamente" });
  } catch (error) {
    console.error("Error al imprimir:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log("Servidor en http://localhost:3001"));
