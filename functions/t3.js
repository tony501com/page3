import { load } from 'cheerio';

// 假设这是你的 HTML 字符串
const html = `
<div class="xcblog-v2ray-box">
  <p>https://node.freeclashnode.com/uploads/2025/03/0-20250303.txt</p>
  <p>https://node.freeclashnode.com/uploads/2025/03/1-20250303.txt</p>
  <p>https://node.freeclashnode.com/uploads/2025/03/2-20250303.txt</p>
  <p>https://node.freeclashnode.com/uploads/2025/03/3-20250303.txt</p>
  <p>https://node.freeclashnode.com/uploads/2025/03/4-20250303.txt</p>
</div>
`;

// 加载 HTML
const $ = cheerio.load(html);

// 提取所有 <p> 标签的内容
const pContents = [];
$('div.xcblog-v2ray-box p').each((index, element) => {
  pContents.push($(element).text());
});

// 输出结果
console.log(pContents);