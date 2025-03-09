import * as cheerio from 'cheerio';

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
   const results = await Promise.all(
     filteredParagraphs.map(async url => {
       try {
         // 获取 URL 的网页内容
         const pageResponse = await fetch(url);
         const pageHtml = await pageResponse.text();

         // 使用 Cheerio 提取网页的文本内容
         const page$ = cheerio.load(pageHtml);
         const pageText = page$('body').text(); // 提取整个 <body> 的文本内容

         return {
           url,
           text: pageText.trim(), // 去除多余空白字符
         };
       } catch (error) {
         return {
           url,
           error: error.message, // 如果抓取失败，返回错误信息
         };
       }
     })
   );

   // 返回结果
   return new Response(JSON.stringify(results, null, 2), {
     headers: { 'Content-Type': 'application/json' },
   });
 } catch (error) {
   return new Response(JSON.stringify({ error: error.message }), {
     status: 500,
     headers: { 'Content-Type': 'application/json' },
   });
 }
}