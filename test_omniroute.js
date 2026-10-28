import http from 'http';

console.log('\n================================================================');
console.log('            OMNIROUTE LOCAL AI GATEWAY HEALTH CHECK             ');
console.log('================================================================\n');

const options = {
  hostname: '127.0.0.1',
  port: 20128,
  path: '/v1/models',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-omniroute-local'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`✔ OmniRoute Gateway HTTP Status: ${res.statusCode}`);
    if (res.statusCode === 200 || res.statusCode === 401 || res.statusCode === 307) {
      console.log('✔ OmniRoute is active, healthy, and listening on port 20128!');
      try {
        const json = JSON.parse(data);
        console.log(`✔ Available Models Catalog:`, json.data ? json.data.length + ' models' : 'Catalog initialized');
      } catch (e) {
        console.log('ℹ️ Gateway Response:', data.slice(0, 150));
      }
    } else {
      console.log(`⚠️ Unexpected status code: ${res.statusCode}`);
    }
    console.log('\n================================================================\n');
  });
});

req.on('error', (e) => {
  console.error(`❌ Could not connect to OmniRoute: ${e.message}`);
});

req.end();
