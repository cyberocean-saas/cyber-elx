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
    },

    // SPA General Pages
    async getGeneralPages() {
      const response = await client.get('/api/plugin_api/el-x/general_pages_elx_spa');
      // if(response.data?.debug) {
      //   console.log(response.data.debug);
      // }
      // console.log(response.data);
      return response.data;
    },

    async setGeneralPages(items) {
      const response = await client.post('/api/plugin_api/el-x/general_pages_elx_spa', { items });
      // if(response.data?.debug) {
      //   console.log(response.data.debug);
      // }
      return response.data;
    },

    // SPA Teacher Dashboard
    async getTeacherDashboard() {
      const response = await client.get('/api/plugin_api/el-x/teacher_dashboard_elx_spa');
      // if(response.data?.debug) {
      //   console.log(response.data.debug);
      // }
      return response.data;
    },

    async setTeacherDashboard(items) {
      const response = await client.post('/api/plugin_api/el-x/teacher_dashboard_elx_spa', { items });
      // if(response.data?.debug) {
      //   console.log(response.data.debug);
      // }
      return response.data;
    },

    // SPA Student Dashboard
    async getStudentDashboard() {
      const response = await client.get('/api/plugin_api/el-x/student_dashboard_elx_spa');
      // if(response.data?.debug) {
      //   console.log(response.data.debug);
      // }
      return response.data;
    },

    async setStudentDashboard(items) {
      const response = await client.post('/api/plugin_api/el-x/student_dashboard_elx_spa', { items });
      // if(response.data?.debug) {
      //   console.log(response.data.debug);
      // }
      return response.data;
    }
  };
}

module.exports = { createApiClient };
