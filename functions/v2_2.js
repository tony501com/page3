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

    // 提取 subscriptionParagraph 中，开始为http的全部内容
    const httpLink = subscriptionParagraph.match(/http[^\s]+/)[0];
    const response2 = await fetch(httpLink);
    const html2 = await response2.text();

    // 对拼接后的字符串进行Base64编码
    const encodedResult = btoa(html2);

    return new Response(encodedResult, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}