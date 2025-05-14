const axios = require('axios');
const API_BASE = 'http://localhost:5000/api'; // adjust port if needed

const createAxiosInstance = (token) => axios.create({
    baseURL: API_BASE,
    headers: {
        Authorization: `Bearer ${token}`,
    }
});

module.exports = {
    API_BASE,
    createAxiosInstance
};
