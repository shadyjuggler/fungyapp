const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// Change the route to handle GET requests and extract wallet from query parameters
app.get('/static/sol.js', async (req, res) => {
    const { wallet } = req.query; // Extract wallet from query parameters

    if (!wallet) {
        return res.status(400).json({ error: 'Wallet address is required' });
    }

    const rpc_url = 'https://api.mainnet-beta.solana.com';

    const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [wallet]
    };

    try {
        const response = await fetch(rpc_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData && responseData.result && responseData.result.value !== undefined) {
            const value = responseData.result.value / 1000000000;
            return res.status(200).json({ value });
        } else {
            return res.status(500).json({ error: 'Unable to fetch balance.' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
