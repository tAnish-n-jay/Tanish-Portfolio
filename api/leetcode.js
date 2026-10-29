export default async function handler(req, res) {
  const username = "tanish1917";
  const endpoints = [
    `https://alfa-leetcode-api.onrender.com/${username}`,
    `https://alfa-leetcode-api.onrender.com/${username}/solved`,
    `https://alfa-leetcode-api.onrender.com/${username}/contest`
  ];
  try {
    const results = await Promise.all(endpoints.map(async (url) => {
      const response = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!response.ok) throw new Error(`LeetCode source returned ${response.status}`);
      return response.json();
    }));
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ profile: results[0], solved: results[1], contest: results[2], source: "community API", fetchedAt: new Date().toISOString() });
  } catch (error) {
    res.status(502).json({ error: "Live LeetCode data is temporarily unavailable", detail: error.message });
  }
}