// const fetch = require('node-fetch');
import fetch from 'node-fetch';
(async () => { 
  try {
    const response = await fetch('https://freeclashx.github.io/');
    const html = await response.text();
    console.log(html);
  } catch (error) {
    console.error(error);
  }
})();
