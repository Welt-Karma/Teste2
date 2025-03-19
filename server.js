const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Rota para salvar a carta como arquivo de texto
app.post("/salvar-carta", (req, res) => {
    const { title, author, text } = req.body;
    
    if (!title || !author || !text) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    const filePath = path.join(__dirname, "cartas", fileName);

    const content = `Título: ${title}\nAutor: ${author}\n\n${text}`;

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao salvar a carta!" });
        }
        res.json({ message: "Carta salva com sucesso!", file: fileName });
    });
});

// Servir os arquivos de texto da pasta "cartas"
app.use("/cartas", express.static(path.join(__dirname, "cartas")));

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
