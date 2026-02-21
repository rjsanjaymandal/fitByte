const https = require('https');

const url = 'https://bgrombwbemkqtlqicngq.supabase.co/rest/v1/products?select=name,main_image_url&limit=100';
const headers = {
  'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncm9tYndiZW1rcXRscWljbmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzUyMjAsImV4cCI6MjA4NjExMTIyMH0.kCPtQH1R1ejB1TY6osgFwziMrYu44iHi5Y-xM4uDDLw',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncm9tYndiZW1rcXRscWljbmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzUyMjAsImV4cCI6MjA4NjExMTIyMH0.kCPtQH1R1ejB1TY6osgFwziMrYu44iHi5Y-xM4uDDLw'
};

https.get(url, { headers }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('RESULTS:', data);
  });
}).on('error', (err) => {
  console.error('ERROR:', err.message);
});
