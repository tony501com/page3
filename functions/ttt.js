import * as cheerio from 'cheerio';

console.log('Starting script...');

// 判断字符串是否为有效的 Base64
function isBase64(str) {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

function decodeBase64(str) {
  return atob(str);
}

async function fetchWebContent(url) {
  console.log(`Fetching URL: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.text();
}

async function loadWebContents(filteredParagraphs) {
  const str_list = [];

  for (const url of filteredParagraphs) {
    try {
      console.log(`Loading content from: ${url}`);
      const content = await fetchWebContent(url);
      if (isBase64(content)) {
        str_list.push(decodeBase64(content).trim());
      } else {
        str_list.push(content.trim());
      }
    } catch (error) {
      console.error(`Error loading content from ${url}:`, error);
    }
  }

  return str_list;
}

export async function onRequest(context) {
  const { request } = context;

  try {
    // 获取HTML内容
    console.log('Fetching initial HTML...');
    let response = await fetch('https://mianfeiclash.github.io/');
    let html = await response.text();

    // 使用Cheerio加载HTML
    console.log('Loading HTML with Cheerio...');
    let $ = cheerio.load(html);

    // 找第一个 <div class="row item xcblog-blog-item" >
    const blogItem = $('.row.item.xcblog-blog-item').first();
    // 找第一个<a href=... >
    const firstHref = blogItem.find('a').first().attr('href');
    const fullUrl = `https://mianfeiclash.github.io${firstHref}`;
    console.log(`Full URL: ${fullUrl}`);

    // 获取网页内容
    console.log(`Fetching content from: ${fullUrl}`);
    response = await fetch(fullUrl);
    html = await response.text();

    // 使用 Cheerio 加载 HTML
    console.log('Loading fetched HTML with Cheerio...');
    $ = cheerio.load(html);

    // 提取 <div class="xcblog-v2ray-box"> 里面的所有 <p> 标签内容
    const paragraphs = $('div.xcblog-v2ray-box p')
      .map((i, el) => $(el).text())
      .get();

    console.log('Extracted paragraphs:', paragraphs);

    // 遍历每个 URL，读取网页并提取文本内容
    const str_list = await loadWebContents(paragraphs);

    // 将所有字符串用换行符连接成一个字符串
    const combinedStr = str_list.join('\n');
    console.log('Combined string:', combinedStr);

    // 对拼接后的字符串进行Base64编码
    const encodedResult = btoa(combinedStr);
    console.log('Encoded result:', encodedResult);

    // 返回编码后的文本内容
    return new Response(encodedResult, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}