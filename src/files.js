const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

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
    path.join(cwd, 'defaults', 'layouts'),
    // SPA folders
    path.join(cwd, 'SPA_general_pages'),
    path.join(cwd, 'SPA_teacher_dashboard'),
    path.join(cwd, 'SPA_student_dashboard'),
    path.join(cwd, 'SPA_student_dashboard', 'pages')
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

// SPA folder configurations
const SPA_CONFIGS = {
  general_pages: {
    folder: 'SPA_general_pages',
    files: [
      { name: 'login.js', type: 'vue-component' },
      { name: 'register.js', type: 'vue-component' },
      { name: 'payment.js', type: 'vue-component' }
    ]
  },
  teacher_dashboard: {
    folder: 'SPA_teacher_dashboard',
    files: [
      { name: 'teacher_custom_css.css', type: 'css' }
    ]
  },
  student_dashboard: {
    folder: 'SPA_student_dashboard',
    files: [
      { name: 'student_custom_css.css', type: 'css' },
      { name: 'startup.js', type: 'js' },
      { name: 'pages/my_courses.js', type: 'vue-component' },
      { name: 'pages/course_player.js', type: 'vue-component' },
      { name: 'pages/courses_list.js', type: 'vue-component' },
      { name: 'pages/course_detail.js', type: 'vue-component' },
      { name: 'pages/sessions.js', type: 'vue-component' },
      { name: 'pages/profile.js', type: 'vue-component' }
    ]
  }
};

const EMPTY_FILE_MARKERS = {
  'vue-component': '/* EMPTY FILE */',
  'js': '/* EMPTY FILE */',
  'css': '/* EMPTY FILE */'
};

function getSpaFilePath(spaKey, fileName, cwd = process.cwd()) {
  const config = SPA_CONFIGS[spaKey];
  if (!config) return null;
  return path.join(cwd, config.folder, fileName);
}

function readSpaFile(spaKey, fileName, cwd = process.cwd()) {
  const filePath = getSpaFilePath(spaKey, fileName, cwd);
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content === '/* EMPTY FILE */') {
    return '';
  }
  return content;
}

function writeSpaFile(spaKey, fileName, content, cwd = process.cwd()) {
  const filePath = getSpaFilePath(spaKey, fileName, cwd);
  if (!filePath) return;
  
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Determine file type for empty marker
  const ext = path.extname(fileName).slice(1).toLowerCase();
  const isVueComponent = fileName.startsWith('pages/') || 
    (spaKey === 'general_pages' && ext === 'js');
  const fileType = isVueComponent ? 'vue-component' : ext;
  
  if (!content || content.trim() === '') {
    fs.writeFileSync(filePath, EMPTY_FILE_MARKERS[fileType] || '/* EMPTY FILE */', 'utf-8');
  } else {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

function spaFileExists(spaKey, fileName, cwd = process.cwd()) {
  const filePath = getSpaFilePath(spaKey, fileName, cwd);
  return filePath && fs.existsSync(filePath);
}

function getLocalSpaFiles(spaKey, cwd = process.cwd()) {
  const config = SPA_CONFIGS[spaKey];
  if (!config) return [];
  
  const items = [];
  const folderPath = path.join(cwd, config.folder);
  
  if (!fs.existsSync(folderPath)) return [];
  
  // Read all expected files
  for (const fileConfig of config.files) {
    const filePath = path.join(folderPath, fileConfig.name);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf-8');
      if (content === '/* EMPTY FILE */') {
        content = '';
      }
      items.push({
        name: fileConfig.name,
        type: fileConfig.type,
        content
      });
    }
  }
  
  return items;
}

async function updateDevDoc() {
  const devDocDir = path.join(process.cwd(), 'DEV_DOC');
  const configFileExists = fs.existsSync(path.join(process.cwd(), 'cyber-elx.jsonc'));

  if (configFileExists) {
    if (!fs.existsSync(devDocDir)) {
      fs.mkdirSync(devDocDir, { recursive: true });
    }

    const files = fs.readdirSync(path.join(__dirname, '..', 'DEV_DOC'));
    
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
  updateDevDoc,
  // SPA exports
  SPA_CONFIGS,
  EMPTY_FILE_MARKERS,
  getSpaFilePath,
  readSpaFile,
  writeSpaFile,
  spaFileExists,
  getLocalSpaFiles
};
