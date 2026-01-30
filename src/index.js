const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
const { readConfig, writeConfig, validateConfig, configExists } = require('./config');
const { readCache, writeCache, getPageTimestamp, setPageTimestamp, getSpaTimestamp, setSpaTimestamp } = require('./cache');
const { createApiClient } = require('./api');
const { ensureDirectories, writePageFile, getLocalPages, DEFAULT_TEMPLATE_KEYS, fileExists, readPageFile, getFilePath, getFolder, updateDevDoc, SPA_CONFIGS, writeSpaFile, getLocalSpaFiles } = require('./files');
const { promptInitConfig, confirmOverwrite, confirmUpload } = require('./prompts');
const { compileComponentTemplates, componentObjectToJsCode, parseComponentJsCode } = require('./vue-utils');

program
  .name('cyber-elx')
  .description('CLI tool to upload/download ELX custom pages');

program
  .option('-v, -V, --version', 'output the version number')
  .hook('preAction', (thisCommand) => {
    if (thisCommand.opts().version) {
      console.log(packageJson.version);
      process.exit(0);
    }
  });

program
  .command('init')
  .description('Initialize configuration and download pages')
  .action(async () => {
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
      
      await updateDevDoc();
      
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
  
  // Download SPA folders
  await downloadSpaFolders(cwd, api, cache, force);
  
  writeCache(cache, cwd);
}

async function downloadSpaFolders(cwd, api, cache, force = false) {
  console.log(chalk.blue('\n--- SPA Folders ---'));
  
  const spaEndpoints = {
    general_pages: { get: () => api.getGeneralPages(), name: 'SPA_general_pages' },
    teacher_dashboard: { get: () => api.getTeacherDashboard(), name: 'SPA_teacher_dashboard' },
    student_dashboard: { get: () => api.getStudentDashboard(), name: 'SPA_student_dashboard' }
  };
  
  for (const [spaKey, endpoint] of Object.entries(spaEndpoints)) {
    console.log(chalk.blue(`\nDownloading ${endpoint.name}...`));
    
    try {
      const response = await endpoint.get();
      const remoteItems = response.items || [];
      const remoteUpdatedAt = response.updated_at || null;
      const cachedTimestamp = getSpaTimestamp(cache, spaKey);
      
      // Check for conflicts
      if (remoteUpdatedAt && cachedTimestamp && remoteUpdatedAt > cachedTimestamp && !force) {
        const shouldOverwrite = await confirmOverwrite(endpoint.name, 'has been modified on server');
        if (!shouldOverwrite) {
          console.log(chalk.yellow(`  ⊘ ${endpoint.name} (skipped)`));
          continue;
        }
      }
      
      // Get expected files from config
      const config = SPA_CONFIGS[spaKey];
      const expectedFiles = config.files.map(f => f.name);
      
      // Create a map of remote items by name
      const remoteItemsMap = new Map();
      for (const item of remoteItems) {
        remoteItemsMap.set(item.name, item);
      }
      
      // Download/create each expected file
      for (const fileConfig of config.files) {
        const remoteItem = remoteItemsMap.get(fileConfig.name);
        let content = '';
        
        if (remoteItem && remoteItem.data) {
          if (fileConfig.type === 'vue-component') {
            // Convert component object back to JS code
            content = componentObjectToJsCode(remoteItem.data);
          } else {
            // CSS or JS - raw content
            content = remoteItem.data;
          }
        }
        
        writeSpaFile(spaKey, fileConfig.name, content, cwd);
        console.log(chalk.green(`  ✓ ${endpoint.name}/${fileConfig.name}`));
      }
      
      // Update cache timestamp
      if (remoteUpdatedAt) {
        setSpaTimestamp(cache, spaKey, remoteUpdatedAt);
      }
      
    } catch (err) {
      console.log(chalk.yellow(`  ⚠ Could not download ${endpoint.name}: ${err.message}`));
    }
  }
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
  
  // Upload SPA folders
  await uploadSpaFolders(cwd, api, cache, force);
  
  writeCache(cache, cwd);
}

async function uploadSpaFolders(cwd, api, cache, force = false) {
  console.log(chalk.blue('\n--- SPA Folders ---'));
  
  const spaEndpoints = {
    general_pages: { 
      get: () => api.getGeneralPages(), 
      set: (items) => api.setGeneralPages(items), 
      name: 'SPA_general_pages' 
    },
    teacher_dashboard: { 
      get: () => api.getTeacherDashboard(), 
      set: (items) => api.setTeacherDashboard(items), 
      name: 'SPA_teacher_dashboard' 
    },
    student_dashboard: { 
      get: () => api.getStudentDashboard(), 
      set: (items) => api.setStudentDashboard(items), 
      name: 'SPA_student_dashboard' 
    }
  };
  
  for (const [spaKey, endpoint] of Object.entries(spaEndpoints)) {
    console.log(chalk.blue(`\nUploading ${endpoint.name}...`));
    
    try {
      // Get local files
      const localFiles = getLocalSpaFiles(spaKey, cwd);
      
      if (localFiles.length === 0) {
        console.log(chalk.yellow(`  No files found in ${endpoint.name}`));
        continue;
      }
      
      // Check for server conflicts
      const remoteResponse = await endpoint.get();
      const remoteUpdatedAt = remoteResponse.updated_at || null;
      const cachedTimestamp = getSpaTimestamp(cache, spaKey);
      
      if (remoteUpdatedAt && cachedTimestamp && remoteUpdatedAt > cachedTimestamp && !force) {
        const shouldUpload = await confirmUpload(endpoint.name, 'has been modified on server since last download');
        if (!shouldUpload) {
          console.log(chalk.yellow(`  ⊘ ${endpoint.name} (skipped)`));
          continue;
        }
      }
      
      // Prepare items for upload
      const itemsToUpload = [];
      let hasError = false;
      
      for (const file of localFiles) {
        const item = {
          name: file.name,
          type: file.type,
          data: null
        };
        
        if (file.type === 'vue-component') {
          // Parse and compile Vue component
          if (!file.content || file.content.trim() === '') {
            item.data = null;
          } else {
            try {
              const componentObj = parseComponentJsCode(file.content);
              const compiledComponent = compileComponentTemplates(componentObj);
              item.data = compiledComponent;
            } catch (err) {
              console.log(chalk.red(`  ✗ ${endpoint.name}/${file.name}: Vue compilation failed - ${err.message}`));
              hasError = true;
              break;
            }
          }
        } else {
          // CSS or JS - raw content
          item.data = file.content || '';
        }
        
        itemsToUpload.push(item);
        console.log(chalk.cyan(`  → ${endpoint.name}/${file.name}`));
      }
      
      if (hasError) {
        console.log(chalk.red(`  Upload cancelled for ${endpoint.name} due to compilation errors`));
        continue;
      }
      
      // Upload to server
      const response = await endpoint.set(itemsToUpload);
      
      if (response.updated_at) {
        setSpaTimestamp(cache, spaKey, response.updated_at);
      }
      
      console.log(chalk.green(`  ✓ ${endpoint.name} uploaded successfully`));
      
    } catch (err) {
      console.log(chalk.red(`  ✗ Could not upload ${endpoint.name}: ${err.message}`));
    }
  }
}

program.parse();
