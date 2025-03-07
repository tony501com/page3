import * as cheerio from 'cheerio';

export async function onRequest(context) {
  const htmlString = `<div><h1>Hello, World!</h1><p>This is a paragraph.</p></div>`;
  const $ = cheerio.load(htmlString);
 
  // 使用类似 jQuery 的语法操作 DOM
  const h1Text = $('h1').text();
  const pText = $('p').text();
  console.log(`h1: ${h1Text}, p: ${pText}`);
  return new Response(`h1: ${h1Text}, p: ${pText}`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}