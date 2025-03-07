import cheerio from 'cheerio';

export async function onRequest(context) {
    // 示例 HTML 内容
    const html = `
        <html>
            <head>
                <title>Test Page</title>
            </head>
            <body>
                <h1>Hello, Cheerio!</h1>
            </body>
        </html>
    `;

    // 使用 cheerio 加载 HTML
    const $ = cheerio.load(html);

    // 提取标题
    const title = $('title').text();
    const heading = $('h1').text();

    // 返回解析结果
    return new Response(JSON.stringify({ title, heading }), {
        headers: { 'Content-Type': 'application/json' },
    });
}