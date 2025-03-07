import * as cheerio from 'cheerio';

export async function onRequestGet(context) {
  try {
    // 使用 fetch API 获取Free Clash X 首页的 HTML 内容
    const response = await fetch('https://freeclashx.github.io/');
    const html = await response.text();

    // 使用Cheerio加载HTML
    const $ = cheerio.load(html);
  
    // 提取第一个 class="xcblog-blog-url" 的 href
    const firstHref = $('.xcblog-blog-url').first().attr('href');
    // tt= 'https://freeclashx.github.io' + firstHref
    const fullUrl = `https://freeclashx.github.io${firstHref}`;
    const response2 = await fetch(fullUrl);
    const html2 = await response2.text();

    // 返回提取的href内容
    return new Response(html2, {
      headers: { 'Content-Type': 'text/plain' },
    });  } catch (error) {
    // 处理错误
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}