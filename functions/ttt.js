import * as cheerio from 'cheerio';

// 判断字符串是否为有效的 Base64
function isBase64(str) {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

function decodeBase64(str) {
  return atob(str);
}

async function fetchWebContent(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.text();
}

async function loadWebContents(filteredParagraphs) {
  const str_list = [];

  for (const url of filteredParagraphs) {
    try {
      const content = await fetchWebContent(url);
      if (isBase64(content)) {
        str_list.push(decodeBase64(content).trim());
      } else {
        str_list.push(content.trim());
      }
    } catch (error) {
      console.error(error);
    }
  }

  return str_list;
}

export async function onRequest(context) {
  const { request } = context;
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const today = new Date();
  const formattedDate = formatDate(today);

  const url_list = [];
  for (let i = 0; i <= 5; i++) {
    url_list.push(`https://node.freeclashnode.com/uploads/${formattedDate.yyyy}/${formattedDate.mm}/${i}-${formattedDate.yyyymmdd}.txt`);
  }
  try {

    // 遍历每个 URL，读取网页并提取文本内容
    const str_list = await loadWebContents(url_list);

    // 将所有字符串用换行符连接成一个字符串
    const combinedStr = str_list.join('\n');

    // 对拼接后的字符串进行Base64编码
    const encodedResult = btoa(combinedStr);

    // 返回编码后的文本内容
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