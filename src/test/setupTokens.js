// setupTokens.js
const axios = require('axios');
const {createAxiosInstance} = require("./utils");

let standardUserToken;
let adminUserToken;

const api = createAxiosInstance()

async function initializeTokens() {
    // Register standard user
    await api.post('/users/register', {
        email: 'standard@test.com',
        password: 'password123',
        role: 'user',
    });

    const standardLogin = await api.post('/auth/login', {
        email: 'standard@test.com',
        password: 'password123',
    });

    standardUserToken = standardLogin.data.token;

    // Register admin user
    await api.post('/users/register', {
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
    });

    const adminLogin = await api.post('/auth/login', {
        email: 'admin@test.com',
        password: 'password123',
    });

    adminUserToken = adminLogin.data.token;
}

async function cleanupUsers() {
    await api.delete('/users/me', {
        headers: { Authorization: `Bearer ${standardUserToken}` },
    });

    await api.delete('/users/me', {
        headers: { Authorization: `Bearer ${adminUserToken}` },
    });
}

function getStandardUserToken() {
    return standardUserToken;
}

function getAdminUserToken() {
    return adminUserToken;
}

module.exports = {
    initializeTokens,
    cleanupUsers,
    getStandardUserToken,
    getAdminUserToken,
};
