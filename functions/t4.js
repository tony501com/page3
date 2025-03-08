import * as cheerio from 'cheerio';


export async function onRequest(context) {
  try {
    // 获取网页内容
    const response = await fetch('https://freeclashx.github.io/free-nodes/2025-3-7-clash-v2ray-ss-ssr.htm'); // 替换为你要抓取的网页URL
    const html = await response.text();

    // 使用 Cheerio 加载 HTML
    const $ = cheerio.load(html);

    // 提取 <div class="col-md-9"> 里面的所有 <p> 标签内容
    const paragraphs = $('div.col-md-9 p')
      .map((i, el) => $(el).text())
      .get();

    // 过滤出以 .txt 结尾的内容
    const filteredParagraphs = paragraphs.filter(content => content.endsWith('.txt'));

    // 返回结果
    return new Response(JSON.stringify(filteredParagraphs[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}