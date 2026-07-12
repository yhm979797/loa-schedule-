const BASE_URL = "https://developer-lostark.game.onstove.com";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  if (req.method !== "GET") return res.status(405).json({ message: "GET 요청만 가능합니다." });

  const name = String(req.query.name || "").trim();
  if (!name) return res.status(400).json({ message: "캐릭터명을 입력해 주세요." });

  const token = process.env.LOSTARK_API_KEY;
  if (!token) return res.status(500).json({ message: "Vercel 환경변수 LOSTARK_API_KEY가 없습니다." });

  const headers = { accept: "application/json", authorization: `bearer ${token}` };
  try {
    const [profileRes, siblingsRes] = await Promise.all([
      fetch(`${BASE_URL}/armories/characters/${encodeURIComponent(name)}/profiles`, { headers }),
      fetch(`${BASE_URL}/characters/${encodeURIComponent(name)}/siblings`, { headers }),
    ]);

    if (profileRes.status === 404 || siblingsRes.status === 404) {
      return res.status(404).json({ message: "캐릭터를 찾지 못했습니다." });
    }
    if (profileRes.status === 401 || siblingsRes.status === 401) {
      return res.status(401).json({ message: "로스트아크 API Key를 확인해 주세요." });
    }
    if (!profileRes.ok || !siblingsRes.ok) {
      return res.status(502).json({ message: `로스트아크 API 오류 (${profileRes.status}/${siblingsRes.status})` });
    }

    const profile = await profileRes.json();
    const siblings = await siblingsRes.json();
    const characters = (siblings || [])
      .filter((item) => item.CharacterName)
      .map((item) => ({
        id: `${item.ServerName}-${item.CharacterName}`,
        name: item.CharacterName,
        server: item.ServerName || "",
        job: item.CharacterClassName || "",
        level: Number(String(item.ItemAvgLevel || "0").replace(/,/g, "")) || 0,
      }))
      .sort((a, b) => b.level - a.level);

    return res.status(200).json({ profile, characters });
  } catch (error) {
    return res.status(500).json({ message: error?.message || "캐릭터 조회 중 오류가 발생했습니다." });
  }
}
