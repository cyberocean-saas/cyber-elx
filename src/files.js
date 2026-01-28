const fs = require('fs');
const path = require('path');

const DEFAULT_TEMPLATE_KEYS = [
  'home_page',
  'courses_page',
  'course_page',
  'about_page',
  'category_page',
  'blogs_page',
  'blog_page',
  'contact_page'
];

function ensureDirectories(cwd = process.cwd()) {
  const dirs = [
    path.join(cwd, 'sections'),
    path.join(cwd, 'templates'),
    path.join(cwd, 'layouts'),
    path.join(cwd, 'defaults', 'sections'),
    path.join(cwd, 'defaults', 'templates'),
    path.join(cwd, 'defaults', 'layouts')
  ];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

function getFolder(type) {
  if (type === 'template') return 'templates';
  if (type === 'section') return 'sections';
  if (type === 'layout') return 'layouts';
  return type + 's';
}

function getFilePath(type, key, cwd = process.cwd(), isDefault = false) {
  const folder = getFolder(type);
  if (isDefault) {
    return path.join(cwd, 'defaults', folder, `${key}.liquid`);
  }
  return path.join(cwd, folder, `${key}.liquid`);
}

function readPageFile(type, key, cwd = process.cwd()) {
  const filePath = getFilePath(type, key, cwd);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  if(content == `<!-- EMPTY FILE -->`) {
    return "";
  }
  return content;
}

function writePageFile(type, key, content, cwd = process.cwd(), isDefault = false) {
  const filePath = getFilePath(type, key, cwd, isDefault);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if(content) {
    fs.writeFileSync(filePath, content, 'utf-8');
  } else {
    fs.writeFileSync(filePath, `<!-- EMPTY FILE -->`, 'utf-8');
  }
}

function fileExists(type, key, cwd = process.cwd()) {
  const filePath = getFilePath(type, key, cwd);
  return fs.existsSync(filePath);
}

function getLocalPages(cwd = process.cwd()) {
  const pages = [];
  
  const templatesDir = path.join(cwd, 'templates');
  const sectionsDir = path.join(cwd, 'sections');
  const layoutsDir = path.join(cwd, 'layouts');
  
  if (fs.existsSync(templatesDir)) {
    const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.liquid'));
    for (const file of files) {
      const key = file.replace('.liquid', '');
      let content = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
      if(content == `<!-- EMPTY FILE -->`) {
        content = "";
      }
      pages.push({ type: 'template', key, content });
    }
  }
  
  if (fs.existsSync(sectionsDir)) {
    const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));
    for (const file of files) {
      const key = file.replace('.liquid', '');
      let content = fs.readFileSync(path.join(sectionsDir, file), 'utf-8');
      if(content == `<!-- EMPTY FILE -->`) {
        content = "";
      }
      pages.push({ type: 'section', key, content });
    }
  }
  
  if (fs.existsSync(layoutsDir)) {
    const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.liquid'));
    for (const file of files) {
      const key = file.replace('.liquid', '');
      let content = fs.readFileSync(path.join(layoutsDir, file), 'utf-8');
      if(content == `<!-- EMPTY FILE -->`) {
        content = "";
      }
      pages.push({ type: 'layout', key, content });
    }
  }
  
  return pages;
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

module.exports = {
  DEFAULT_TEMPLATE_KEYS,
  ensureDirectories,
  getFolder,
  getFilePath,
  readPageFile,
  writePageFile,
  fileExists,
  getLocalPages,
  updateDevDoc
};
