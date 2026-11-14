const fs = require("node:fs");

fs.cpSync("public", "dist/public", { recursive: true });
console.log("Front-end copiado para dist/public");
