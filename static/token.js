const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

app.post('/get-token-accounts', async (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    const rpc_url = 'https://api.mainnet-beta.solana.com/';

    const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
            address,
            { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
            { encoding: 'jsonParsed' }
        ]
    };

    try {
        const response = await fetch(rpc_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData && responseData.result && responseData.result.value) {
            const accounts = responseData.result.value;
            let count = 0;

            accounts.forEach(account => {
                if (account.account.data.parsed.info.tokenAmount.amount === '1') {
                    count++;
                }
            });

            return res.status(200).json({ count });
        } else {
            return res.status(500).json({ error: 'Unable to fetch token accounts.' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
