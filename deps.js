const fs = require('fs');
const path = require('path');

const targetFile = './env.mjs'; // Change this
const projectRoot = './';

function findImports(root) {
  const files = fs.readdirSync(root);

  files.forEach((file) => {
    const fullPath = path.join(root, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findImports(fullPath);
    } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(targetFile)) {
        console.log(`Found in: ${fullPath}`);
      }
    }
  });
}

findImports(projectRoot);
