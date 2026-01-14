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

console.log('Fetching process movements to find full text content...');

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
          
          // Filter movements from November 2024 to inspect closely
          const recentMovements = process.movimentos.filter(m => m.dataHora.includes('2024-11'));
          
          console.log("=== MOVEMENTS FROM NOV 2024 ===");
          console.log(JSON.stringify(recentMovements, null, 2));
          
          // Check for any other potential fields in the root object
          console.log("\n=== ROOT KEYS ===");
          console.log(Object.keys(process));

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
