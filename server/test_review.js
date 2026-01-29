const axios = require('axios');

async function testApi() {
    const API_URL = 'http://localhost:5000/api';
    const collegeId = '65e9f8a3c1a2b3c4d5e6f7a8'; // Change this to a real ID if possible

    console.log('--- API TEST START ---');
    try {
        console.log(`[GET] Fetching College: ${collegeId}`);
        const resGet = await axios.get(`${API_URL}/user/colleges/${collegeId}`);
        console.log('[GET] Success!', resGet.status);
    } catch (err) {
        console.log('[GET] Failed!', err.response?.status, err.response?.data?.message || err.message);
    }

    try {
        console.log(`[POST] Adding Review for: ${collegeId}`);
        const resPost = await axios.post(`${API_URL}/user/colleges/review/${collegeId}`, {
            rating: 5,
            comment: 'Test comment'
        });
        console.log('[POST] Success!', resPost.status);
    } catch (err) {
        console.log('[POST] Failed!', err.response?.status, err.response?.data?.message || err.message);
    }
}

testApi();
