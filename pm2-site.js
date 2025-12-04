const { spawn } = require("child_process");
const path = require("path");

// Caminho real do npm-cli.js (funciona em qualquer instalação padrão do Node no Windows)
const npmPath = path.join(process.env.APPDATA, "..", "Roaming", "npm", "node_modules", "npm", "bin", "npm-cli.js");

// Executa “node npm-cli.js run start-static”
spawn(process.execPath, [npmPath, "run", "start-static"], {
  stdio: "inherit",
  cwd: __dirname
});
