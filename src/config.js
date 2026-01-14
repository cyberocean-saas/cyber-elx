const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc-parser');

const CONFIG_FILE = 'cyber-elx.jsonc';

function getConfigPath(cwd = process.cwd()) {
  return path.join(cwd, CONFIG_FILE);
}

function configExists(cwd = process.cwd()) {
  return fs.existsSync(getConfigPath(cwd));
}

function readConfig(cwd = process.cwd()) {
  const configPath = getConfigPath(cwd);
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const content = fs.readFileSync(configPath, 'utf-8');
  return jsonc.parse(content);
}

function writeConfig(config, cwd = process.cwd()) {
  const configPath = getConfigPath(cwd);
  const content = `{
  // ELX Custom Pages Configuration
  // URL of your website (without trailing slash)
  "url": "${config.url}",
  // Authentication token (get from admin panel)
  "token": "${config.token}"
}
`;
  fs.writeFileSync(configPath, content, 'utf-8');
}

function validateConfig(config) {
  if (!config) {
    return { valid: false, error: 'Config file not found. Run "cyber-elx init" first.' };
  }
  if (!config.url) {
    return { valid: false, error: 'Missing "url" in config file.' };
  }
  if (!config.token) {
    return { valid: false, error: 'Missing "token" in config file.' };
  }
  return { valid: true };
}

module.exports = {
  CONFIG_FILE,
  getConfigPath,
  configExists,
  readConfig,
  writeConfig,
  validateConfig
};
