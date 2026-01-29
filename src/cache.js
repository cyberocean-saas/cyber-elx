const fs = require('fs');
const path = require('path');

const CACHE_FILE = '.cache';

function getCachePath(cwd = process.cwd()) {
  return path.join(cwd, CACHE_FILE);
}

function readCache(cwd = process.cwd()) {
  const cachePath = getCachePath(cwd);
  if (!fs.existsSync(cachePath)) {
    return { pages: {}, spa: {} };
  }
  try {
    const content = fs.readFileSync(cachePath, 'utf-8');
    const cache = JSON.parse(content);
    if (!cache.spa) cache.spa = {};
    return cache;
  } catch (e) {
    return { pages: {}, spa: {} };
  }
}

function writeCache(cache, cwd = process.cwd()) {
  const cachePath = getCachePath(cwd);
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
}

function getPageCacheKey(type, key) {
  return `${type}:${key}`;
}

function getPageTimestamp(cache, type, key) {
  const cacheKey = getPageCacheKey(type, key);
  return cache.pages[cacheKey]?.updated_at || null;
}

function setPageTimestamp(cache, type, key, updated_at) {
  const cacheKey = getPageCacheKey(type, key);
  if (!cache.pages) {
    cache.pages = {};
  }
  cache.pages[cacheKey] = { updated_at };
}

// SPA cache functions (per-folder caching)
function getSpaTimestamp(cache, spaKey) {
  return cache.spa[spaKey]?.updated_at || null;
}

function setSpaTimestamp(cache, spaKey, updated_at) {
  if (!cache.spa) {
    cache.spa = {};
  }
  cache.spa[spaKey] = { updated_at };
}

module.exports = {
  CACHE_FILE,
  getCachePath,
  readCache,
  writeCache,
  getPageCacheKey,
  getPageTimestamp,
  setPageTimestamp,
  getSpaTimestamp,
  setSpaTimestamp
};
