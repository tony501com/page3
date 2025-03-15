export async function onRequest(context) {
  try {
    const response = await fetch('https://node.freeclashnode.com/uploads/2025/03/2-20250314.txt', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
    });

    console.log('Fetch request completed with status:', response.status);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Fetch request successful, returning HTML response.');

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error fetching the URL:', error);  // 增加日志记录
    return new Response(JSON.stringify({ error: error.message, reference: 'mc9kjrm6q7aucltbkkquq3mh' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}