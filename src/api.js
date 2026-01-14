const axios = require('axios');

function createApiClient(config) {
  const client = axios.create({
    baseURL: config.url,
    headers: {
      '_token': config.token,
      'Content-Type': 'application/json'
    }
  });

  return {
    async getPages() {
      const response = await client.get('/api/plugin_api/el-x/get_elx_pages');
      return response.data;
    },

    async updatePages(pages) {
      try {
        const response = await client.post('/api/plugin_api/el-x/update_elx_pages', { pages });
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async getDefaultPages() {
      const response = await client.get('/api/plugin_api/el-x/get_defaults_for_elx_pages');
      return response.data;
    }
  };
}

module.exports = { createApiClient };
