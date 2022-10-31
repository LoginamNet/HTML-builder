const path = require('path');
const fs = require('fs');

const text = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(text,  'utf-8');

let result = ``;

stream.on('data', chunk => result += chunk);
stream.on('end', () => console.log(result));
stream.on('error', error => console.log('Error', error.message));