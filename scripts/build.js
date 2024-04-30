const fs = require("fs-extra");
const path = require("path");

const data = `#!/usr/bin/env node\n
${fs.readFileSync(path.resolve(__dirname, "../dist/index.js"))}
`;
fs.writeFileSync(path.resolve(__dirname, "../bin/index.js"), data);
fs.copyFileSync(
  path.resolve(__dirname, "../dist/index.js.map"),
  path.resolve(__dirname, "../bin/index.js.map")
);
