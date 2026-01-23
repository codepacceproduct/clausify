const axios = require('axios');

const CAKTO_BASE_URL = 'https://api.cakto.com.br';
const CLIENT_ID = 'A4jHB5bi9dCyHeTz0L8mJHuUEMJatJo5Zc2nyrgI';
const CLIENT_SECRET = 'KtKuj0xTcBOKtjRjtLYvAMdm0fSLbxBz08TBeNQ4G7tNAco0uWdRU5r30N3DYYfTZC2kh1wX2vQIFpJWl8LKbCkTzhyZIhWljoQRofJAYcdpnvXCGPx8EZdeM9snhbsS';

async function testCakto() {
    try {
        console.log('1. Testing Authentication (No explicit scopes)...');
        const params = new URLSearchParams();
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        // params.append('scope', 'read write orders products offers pix payments transactions'); 

        // Test multiple auth endpoints
        const authEndpoints = [
            '/public_api/token/',
        ];

        let token = null;

        for (const authPath of authEndpoints) {
            try {
                console.log(`Trying auth endpoint: ${authPath}`);
                // Reset params for each try
                const currentParams = new URLSearchParams();
                currentParams.append('client_id', CLIENT_ID);
                currentParams.append('client_secret', CLIENT_SECRET);
                // No grant_type

                const authRes = await axios.post(`${CAKTO_BASE_URL}${authPath}`, currentParams, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                console.log(`✅ Auth Success on ${authPath}`);
                console.log('Auth Response Body:', authRes.data);
                token = authRes.data.access_token;
                break; // Stop if we get a token
            } catch (e) {
                console.log(`❌ Auth Failed on ${authPath}: ${e.response?.status}`);
            }
        }

        if (!token) {
            throw new Error('Could not obtain token from any endpoint');
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // 2. Testing Offers (to get Checkout URL)
        console.log('\n2. Testing Offers (Checkout Flow)...');
        try {
            const offersRes = await axios.get(`${CAKTO_BASE_URL}/public_api/offers/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            console.log('✅ Offers retrieved:', offersRes.data.results?.length || 0);
            if (offersRes.data.results?.length > 0) {
                console.log('Sample Offer:', JSON.stringify(offersRes.data.results[0], null, 2));
            } else {
                console.log('⚠️ No offers found. Please create an offer in Cakto dashboard.');
            }
        } catch (e) {
             console.log(`❌ Failed to get offers: ${e.response?.status}`);
             console.log(e.response?.data);
        }

        // 3. Testing Payment Endpoints (SKIPPED - We are moving to Checkout Flow)
        console.log('\n3. Testing Payment Endpoints (SKIPPED - Using Checkout Flow)...');

    } catch (error) {
        console.error('❌ Critical Error:', error.response?.data || error.message);
    }
}

testCakto();
