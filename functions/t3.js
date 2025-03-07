import { load } from 'cheerio';

export async function onRequest(context) {
    // 示例 HTML 内容
    const html = `
        <div class="xcblog-v2ray-box">
            <p>https://node.freeclashnode.com/uploads/2025/03/0-20250303.txt</p>
            <p>https://node.freeclashnode.com/uploads/2025/03/1-20250303.txt</p>
            <p>https://node.freeclashnode.com/uploads/2025/03/2-20250303.txt</p>
            <p>https://node.freeclashnode.com/uploads/2025/03/3-20250303.txt</p>
            <p>https://node.freeclashnode.com/uploads/2025/03/4-20250303.txt</p>
        </div>
    `;

    // 使用 cheerio 加载 HTML
    const $ = load(html);

    // 提取所有 <p> 标签的内容
    const pContents = [];
    $('div.xcblog-v2ray-box p').each((index, element) => {
        pContents.push($(element).text());
    });

    // 返回解析结果
    return new Response(JSON.stringify({ pContents }), {
        headers: { 'Content-Type': 'application/json' },
    });
}