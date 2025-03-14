import * as cheerio from 'cheerio';

export async function onRequest(context) {
  const { request } = context;

  // 获取HTML内容
  const response = await fetch('https://www.airportnode.com/');
  const html = await response.text();

  // 使用Cheerio加载HTML
  const $ = cheerio.load(html);

  // 找到第一个 <div class="hotspotinfo"> 再找<a></a> 提取 href
  const hotspotInfo = $('div.hotspotinfo').first();
  const link = hotspotInfo.find('a').attr('href');

  console.log(link); // 输出提取到的链接

  try {
    // 获取网页内容
    const response = await fetch(link); 
    const html = await response.text();

    // 使用 Cheerio 加载 HTML
    const $ = cheerio.load(html);

    // 找 <h3> 订阅链接 </h3> 再找后面第二个<p></p> 提取内容
    const subscriptionHeader = $('h3:contains("订阅链接")');
    const subscriptionParagraph = subscriptionHeader.nextAll('p').eq(1).text();

    // 返回编码后的文本内容
    return new Response(subscriptionParagraph, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}