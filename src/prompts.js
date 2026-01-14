const inquirer = require('inquirer');
const chalk = require('chalk');

async function promptInitConfig() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Enter your website URL (e.g., https://my-website.net):',
      validate: (input) => {
        if (!input) return 'URL is required';
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
          return 'URL must start with http:// or https://';
        }
        return true;
      },
      filter: (input) => input.replace(/\/$/, '')
    },
    {
      type: 'input',
      name: 'token',
      message: 'Enter your authentication token:',
      validate: (input) => input ? true : 'Token is required'
    }
  ]);
  return answers;
}

async function confirmOverwrite(filePath, reason) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `${chalk.yellow(filePath)} ${reason}. Overwrite?`,
      default: false
    }
  ]);
  return confirm;
}

async function confirmUpload(filePath, reason) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `${chalk.cyan(filePath)} ${reason}. Upload anyway?`,
      default: true
    }
  ]);
  return confirm;
}

async function confirmAll(message) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message,
      default: false
    }
  ]);
  return confirm;
}

module.exports = {
  promptInitConfig,
  confirmOverwrite,
  confirmUpload,
  confirmAll
};
