const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const rapidApiKey = '6a381d6a7bmsh822a533b6f6dbfdp1530dbjsn38b24a6d2e6c'; // Replace with your RapidAPI key
const rapidApiHost = 'chatgpt-42.p.rapidapi.com';

app.use(cors()); // Enable CORS

app.get('/dalle', (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt parameter is required' });
  }

  const options = {
    method: 'POST',
    hostname: rapidApiHost,
    path: '/texttoimage',
    headers: {
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': rapidApiHost,
      'Content-Type': 'application/json'
    }
  };

  const apiReq = https.request(options, apiRes => {
    let chunks = [];

    apiRes.on('data', chunk => {
      chunks.push(chunk);
    });

    apiRes.on('end', () => {
      const body = Buffer.concat(chunks);
      const response = JSON.parse(body.toString());
      res.json(response);
    });
  });

  apiReq.on('error', error => {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  });

  apiReq.write(JSON.stringify({ text: prompt, width: 512, height: 512 }));
  apiReq.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
