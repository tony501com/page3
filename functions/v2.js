import * as cheerio from 'cheerio';

// 判断字符串是否为有效的 Base64
function isBase64(str) {
  try {
    // 尝试将字符串从 Base64 解码
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch (error) {
    return false;
  }
}
function convertToSecondFormat(allTexts) {
  return allTexts.map(text => {
    const base64 = Buffer.from(text).toString('base64');
    return base64;
  }).join('\n');
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

    // 遍历每个 URL，读取网页并提取文本内容
    const allTexts = await Promise.all(
      filteredParagraphs.map(async url => {
        try {
          // 获取 URL 的网页内容
          const pageResponse = await fetch(url);
          const pageHtml = await pageResponse.text();

          // 使用 Cheerio 提取网页的文本内容
          const page$ = cheerio.load(pageHtml);
          const text = page$('body').text().trim(); // 提取整个 <body> 的文本内容并去除空白字符

          text = convertToSecondFormat(text);

          return (text) ;
        } catch (error) {
          console.error(`Failed to fetch ${url}:`, error.message);
          return ''; // 如果抓取失败，返回空字符串
        }
      })
    );



    // 转换并拼接结果
    const result = convertToSecondFormat(allTexts);
    // console.log(result);

    // combinedText = result


    // 返回拼接后的文本内容
    return new Response(result, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}