import * as cheerio from 'cheerio';

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
      const content = await fetchWebContent(url);
      str_list.push(content);
    } catch (error) {
      console.error(error);
    }
  }

  return str_list;
}

export async function onRequest(context) {
  const { request } = context;

  // 获取HTML内容
  const response = await fetch('https://freeclashx.github.io/'); // 替换https://freeclashx.github.io/
  const html = await response.text();

  // 使用Cheerio加载HTML
  const $ = cheerio.load(html);

  // 提取第一个 class="xcblog-blog-url" 的 href
  const firstHref = $('.xcblog-blog-url').first().attr('href');
  const fullUrl = 'https://freeclashx.github.io' + firstHref;

  try {
    // 获取网页内容
    const response = await fetch(fullUrl); // 替换为你要抓取的网页URL
    const html = await response.text();

    // 使用 Cheerio 加载 HTML
    const $ = cheerio.load(html);

    // 提取 <div class="col-md-9"> 里面的所有 <p> 标签内容
    const paragraphs = $('div.col-md-9 p')
      .map((i, el) => $(el).text())
      .get();

    // 过滤出以 .txt 结尾的内容（假设这些是 URL）
    const filteredParagraphs = paragraphs.filter(content => content.endsWith('.txt'));

    // // 遍历每个 URL，读取网页并提取文本内容
    // const str_list = await loadWebContents(filteredParagraphs);

    // // 将所有字符串用换行符连接成一个字符串
    // const combinedStr = str_list.join('\n');

    // // 对拼接后的字符串进行Base64编码
    // const encodedResult = btoa(combinedStr);

    // 返回编码后的文本内容
    return new Response(filteredParagraphs, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}