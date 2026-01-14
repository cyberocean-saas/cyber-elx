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
  return fs.readFileSync(filePath, 'utf-8');
}

function writePageFile(type, key, content, cwd = process.cwd(), isDefault = false) {
  const filePath = getFilePath(type, key, cwd, isDefault);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
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
      const content = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
      pages.push({ type: 'template', key, content });
    }
  }
  
  if (fs.existsSync(sectionsDir)) {
    const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));
    for (const file of files) {
      const key = file.replace('.liquid', '');
      const content = fs.readFileSync(path.join(sectionsDir, file), 'utf-8');
      pages.push({ type: 'section', key, content });
    }
  }
  
  if (fs.existsSync(layoutsDir)) {
    const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.liquid'));
    for (const file of files) {
      const key = file.replace('.liquid', '');
      const content = fs.readFileSync(path.join(layoutsDir, file), 'utf-8');
      pages.push({ type: 'layout', key, content });
    }
  }
  
  return pages;
}

module.exports = {
  DEFAULT_TEMPLATE_KEYS,
  ensureDirectories,
  getFolder,
  getFilePath,
  readPageFile,
  writePageFile,
  fileExists,
  getLocalPages
};
