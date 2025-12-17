const express = require("express");
const path = require("path");

const app = express();
const PORT = 5050;

app.use(express.static(path.join(__dirname, "out")));

app.listen(PORT, () => {
  console.log("Servidor estático rodando em http://localhost:" + PORT);
});
