
	const path = require('path');
const { transformSync } = require('esbuild');

// Handle both ESM and CJS config files
async function loadConfig(configPath) {
  try {
    // Handle TypeScript files
    if (configPath.endsWith('.ts')) {
      const result = transformSync(require('fs').readFileSync(configPath, 'utf8'), {
        loader: 'ts',
        format: 'cjs'
      });
      const mod = eval(result.code);
      return mod.default || mod;
    }

    // Handle ESM files (.mjs or package.json type: module)
    if (configPath.endsWith('.mjs') || isEsmProject(path.dirname(configPath))) {
      const { default: mod } = await import(configPath);
      return mod;
    }

    // Fallback to CJS
    const mod = require(configPath);
    return mod.default || mod;
  } catch (error) {
    process.exit(1);
  }
}

function isEsmProject(dir) {
  try {
    const pkg = require(path.join(dir, 'package.json'));
    return pkg.type === 'module';
  } catch {
    return false;
  }
}

// Process functions and special cases
function processConfig(config) {
  const result = {};
  
  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'function') {
      result[key] = {
        __next_core_function__: true,
        source: value.toString()
      };
    } else if (value && typeof value === 'object') {
      result[key] = processConfig(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

// Main execution
async function main() {
  const configPath = path.resolve(process.argv[2]);
  const config = await loadConfig(configPath);
  const processed = processConfig(config);
  console.log(JSON.stringify(processed));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
  
	