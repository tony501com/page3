import cheerio from 'cheerio';

export async function onRequestGet(context) {
  try {
    // 使用 fetch API 获取百度首页的 HTML 内容
    const response = await fetch('https://www.baidu.com');
    const html = await response.text();

    // 使用 cheerio 加载 HTML
    const $ = cheerio.load(html);

    // 提取 <title> 标签的内容
    const title = $('title').text();

    // 返回提取的 title 内容，并设置 charset=utf-8
    return new Response(`Title: ${title}`, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    // 处理错误
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}