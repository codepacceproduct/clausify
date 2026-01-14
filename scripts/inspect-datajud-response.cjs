const https = require('https');

const data = JSON.stringify({
  query: {
    match: {
      numeroProcesso: "10091315220248260224"
    }
  }
});

const options = {
  hostname: 'api-publica.datajud.cnj.jus.br',
  path: '/api_publica_tjsp/_search',
  method: 'POST',
  headers: {
    'Authorization': 'APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Fetching full process details to inspect for documents...');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(responseData);
      if (parsed.hits && parsed.hits.hits.length > 0) {
          const process = parsed.hits.hits[0]._source;
          console.log(JSON.stringify(process, null, 2));
      } else {
          console.log('No hits found.');
      }
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
