const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { readConfig, writeConfig, validateConfig, configExists } = require('./config');
const { readCache, writeCache, getPageTimestamp, setPageTimestamp } = require('./cache');
const { createApiClient } = require('./api');
const { ensureDirectories, writePageFile, getLocalPages, DEFAULT_TEMPLATE_KEYS, fileExists, readPageFile, getFilePath, getFolder } = require('./files');
const { promptInitConfig, confirmOverwrite, confirmUpload } = require('./prompts');

program
  .name('cyber-elx')
  .description('CLI tool to upload/download ELX custom pages')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize configuration and download pages')
  .action(async () => {
    await updateDevDoc();
    try {
      const cwd = process.cwd();
      
      if (configExists(cwd)) {
        console.log(chalk.yellow('Config file already exists. Delete it first if you want to reinitialize.'));
        return;
      }

      const config = await promptInitConfig();
      writeConfig(config, cwd);
      console.log(chalk.green('✓ Config file created: cyber-elx.jsonc'));

      console.log(chalk.blue('Testing connection...'));
      const api = createApiClient(config);
      
      try {
        await api.getPages();
        console.log(chalk.green('✓ Connection successful!'));
      } catch (err) {
        console.log(chalk.red('✗ Connection failed: ' + (err.response?.data?.message || err.message)));
        console.log(chalk.yellow('Config file was created. Fix the credentials and run "cyber-elx download".'));
        return;
      }

      console.log(chalk.blue('Downloading pages...'));
      await downloadPages(cwd, config, true);
      
      console.log(chalk.green('\n✓ Initialization complete!'));
      console.log(chalk.gray('Edit files in sections/ and templates/ folders, then run "cyber-elx upload" to publish.'));
    } catch (err) {
      console.error(chalk.red('Error: ' + err.message));
      process.exit(1);
    }
  });

program
  .command('download')
  .description('Download pages from server')
  .option('-f, --force', 'Force download without confirmation prompts')
  .action(async (options) => {
    await updateDevDoc();
    try {
      const cwd = process.cwd();
      const config = readConfig(cwd);
      const validation = validateConfig(config);
      
      if (!validation.valid) {
        console.error(chalk.red(validation.error));
        process.exit(1);
      }

      await downloadPages(cwd, config, options.force);
    } catch (err) {
      console.error(chalk.red('Error: ' + err.message));
      process.exit(1);
    }
  });

program
  .command('upload')
  .description('Upload pages to server')
  .option('-f, --force', 'Force upload without confirmation prompts')
  .action(async (options) => {
    await updateDevDoc();
    try {
      const cwd = process.cwd();
      const config = readConfig(cwd);
      const validation = validateConfig(config);
      
      if (!validation.valid) {
        console.error(chalk.red(validation.error));
        process.exit(1);
      }

      await uploadPages(cwd, config, options.force);
    } catch (err) {
      console.error(chalk.red('Error: ' + err.message));
      process.exit(1);
    }
  });

async function downloadPages(cwd, config, force = false) {
  const api = createApiClient(config);
  const cache = readCache(cwd);
  
  ensureDirectories(cwd);

  console.log(chalk.blue('Fetching pages from server...'));
  const [pagesResponse, defaultsResponse] = await Promise.all([
    api.getPages(),
    api.getDefaultPages()
  ]);

  if (!pagesResponse.success) {
    throw new Error('Failed to fetch pages: ' + (pagesResponse.message || 'Unknown error'));
  }
  if (!defaultsResponse.success) {
    throw new Error('Failed to fetch defaults: ' + (defaultsResponse.message || 'Unknown error'));
  }

  const remotePages = pagesResponse.pages || [];
  const defaultPages = defaultsResponse.pages || [];

  console.log(chalk.blue('Downloading default pages (read-only)...'));
  // Clear existing defaults before downloading
  const defaultsDirs = [
    path.join(cwd, 'defaults', 'sections'),
    path.join(cwd, 'defaults', 'templates'),
    path.join(cwd, 'defaults', 'layouts')
  ];
  for (const dir of defaultsDirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
  }
  ensureDirectories(cwd);
  
  for (const page of defaultPages) {
    writePageFile(page.type, page.key, page.content, cwd, true);
    console.log(chalk.gray(`  ✓ defaults/${getFolder(page.type)}/${page.key}.liquid`));
  }

  const remotePagesMap = new Map();
  for (const page of remotePages) {
    remotePagesMap.set(`${page.type}:${page.key}`, page);
  }

  const allKeys = new Set();
  
  for (const page of remotePages) {
    allKeys.add(`${page.type}:${page.key}`);
  }
  
  for (const key of DEFAULT_TEMPLATE_KEYS) {
    allKeys.add(`template:${key}`);
  }
  
  for (const page of defaultPages) {
    allKeys.add(`${page.type}:${page.key}`);
  }

  console.log(chalk.blue('\nDownloading custom pages...'));
  let downloadedCount = 0;
  let skippedCount = 0;

  for (const fullKey of allKeys) {
    const [type, key] = fullKey.split(':');
    const remotePage = remotePagesMap.get(fullKey);
    const filePath = `${getFolder(type)}/${key}.liquid`;
    
    const localExists = fileExists(type, key, cwd);
    const localContent = localExists ? readPageFile(type, key, cwd) : null;
    const cachedTimestamp = getPageTimestamp(cache, type, key);
    const remoteTimestamp = remotePage?.updated_at || null;
    const remoteContent = remotePage?.content || '';

    if (!localExists) {
      writePageFile(type, key, remoteContent, cwd);
      if (remoteTimestamp) {
        setPageTimestamp(cache, type, key, remoteTimestamp);
      }
      console.log(chalk.green(`  ✓ ${filePath} (created)`));
      downloadedCount++;
      continue;
    }

    if (remoteTimestamp && cachedTimestamp && remoteTimestamp > cachedTimestamp) {
      if (!force) {
        const shouldOverwrite = await confirmOverwrite(filePath, 'has been modified on server');
        if (!shouldOverwrite) {
          console.log(chalk.yellow(`  ⊘ ${filePath} (skipped)`));
          skippedCount++;
          continue;
        }
      }
      writePageFile(type, key, remoteContent, cwd);
      setPageTimestamp(cache, type, key, remoteTimestamp);
      console.log(chalk.green(`  ✓ ${filePath} (updated)`));
      downloadedCount++;
      continue;
    }

    if (localContent !== remoteContent && !force) {
      if (cachedTimestamp === null && localContent !== '') {
        const shouldOverwrite = await confirmOverwrite(filePath, 'exists locally with different content');
        if (!shouldOverwrite) {
          console.log(chalk.yellow(`  ⊘ ${filePath} (skipped)`));
          skippedCount++;
          continue;
        }
      }
    }

    // if (localContent !== remoteContent) {
      writePageFile(type, key, remoteContent, cwd);
      if (remoteTimestamp) {
        setPageTimestamp(cache, type, key, remoteTimestamp);
      }
      console.log(chalk.green(`  ✓ ${filePath} (updated)`));
      downloadedCount++;
    // } else {
    //   if (remoteTimestamp) {
    //     setPageTimestamp(cache, type, key, remoteTimestamp);
    //   }
    //   console.log(chalk.gray(`  - ${filePath} (unchanged)`));
    // }
  }

  writeCache(cache, cwd);
  
  console.log(chalk.blue(`\nDownload complete: ${downloadedCount} downloaded, ${skippedCount} skipped`));
}

async function uploadPages(cwd, config, force = false) {
  const api = createApiClient(config);
  const cache = readCache(cwd);
  
  const localPages = getLocalPages(cwd);
  
  if (localPages.length === 0) {
    console.log(chalk.yellow('No pages found to upload. Create .liquid files in sections/, templates/ or layouts/ folders.'));
    return;
  }

  console.log(chalk.blue('Checking for conflicts with server...'));
  const pagesResponse = await api.getPages();
  
  if (!pagesResponse.success) {
    throw new Error('Failed to fetch pages: ' + (pagesResponse.message || 'Unknown error'));
  }

  const remotePages = pagesResponse.pages || [];
  const remotePagesMap = new Map();
  for (const page of remotePages) {
    remotePagesMap.set(`${page.type}:${page.key}`, page);
  }

  const pagesToUpload = [];

  for (const localPage of localPages) {
    const fullKey = `${localPage.type}:${localPage.key}`;
    const remotePage = remotePagesMap.get(fullKey);
    const filePath = `${getFolder(localPage.type)}/${localPage.key}.liquid`;
    const cachedTimestamp = getPageTimestamp(cache, localPage.type, localPage.key);

    if (remotePage) {
      const remoteTimestamp = remotePage.updated_at;
      
      if (cachedTimestamp && remoteTimestamp > cachedTimestamp) {
        if (!force) {
          const shouldUpload = await confirmUpload(filePath, 'has been modified on server since last download');
          if (!shouldUpload) {
            console.log(chalk.yellow(`  ⊘ ${filePath} (skipped)`));
            continue;
          }
        }
      }

      // if (localPage.content === remotePage.content) {
      //   console.log(chalk.gray(`  - ${filePath} (unchanged)`));
      //   continue;
      // }
    }

    pagesToUpload.push(localPage);
    console.log(chalk.cyan(`  → ${filePath} (will upload)` + (localPage.content === '' ? ' [EMPTY]' : '')));
  }

  if (pagesToUpload.length === 0) {
    console.log(chalk.yellow('\nNo changes to upload.'));
    return;
  }

  console.log(chalk.blue(`\nUploading ${pagesToUpload.length} page(s)...`));
  
  const response = await api.updatePages(pagesToUpload);
  
  if (!response.success) {
    throw new Error('Upload failed: ' + (response.message || 'Unknown error'));
  }

  const updatedPages = response.updatedpages || [];
  for (const page of updatedPages) {
    setPageTimestamp(cache, page.type, page.key, page.updated_at);
    const filePath = `${getFolder(page.type)}/${page.key}.liquid`;
    console.log(chalk.green(`  ✓ ${filePath} (uploaded)`));
  }

  writeCache(cache, cwd);
  
  console.log(chalk.green(`\n✓ Upload complete: ${updatedPages.length} page(s) updated [${updatedPages.map(p => p.key).join(', ')}]`));
  if(response.debug) {
    console.log(chalk.gray('Debug info:'), response.debug);
  }
}

async function updateDevDoc() {
  const devDocDir = path.join(process.cwd(), 'DEV_DOC');
  const configFileExists = fs.existsSync(path.join(process.cwd(), 'cyber-elx.jsonc'));

  if (configFileExists) {
    if (!fs.existsSync(devDocDir)) {
      fs.mkdirSync(devDocDir, { recursive: true });
    }

    const files = ['ThemeDev.md', 'README.md'];
    
    for (const file of files) {
      const sourceContent = fs.readFileSync(path.join(__dirname, '..', 'DEV_DOC', file), 'utf-8');
      const localPath = path.join(devDocDir, file);
      let localContent = '';
      
      try {
        localContent = fs.readFileSync(localPath, 'utf-8');
      } catch (err) {
      }
      
      if (sourceContent !== localContent) {
        fs.writeFileSync(localPath, sourceContent);
        console.log(chalk.green(`DEV_DOC/${file} was updated`));
      }
    }
  }
}



program.parse();
