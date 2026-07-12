const BASE_URL = "https://developer-lostark.game.onstove.com";

async function lostArkFetch(path, apiKey) {
  const token = String(apiKey || "").replace(/^bearer\s+/i, "").trim();
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      accept: "application/json",
      authorization: `bearer ${token}`,
    },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(body || `Lost Ark API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "GET 요청만 지원합니다." });
  }

  const name = String(req.query.name || "").trim();
  if (!name) return res.status(400).json({ message: "캐릭터명을 입력해 주세요." });

  const apiKey = process.env.LOSTARK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      message: "Vercel 환경변수 LOSTARK_API_KEY가 등록되지 않았습니다.",
    });
  }

  try {
    const [profile, siblings] = await Promise.all([
      lostArkFetch(`/armories/characters/${encodeURIComponent(name)}/profiles`, apiKey),
      lostArkFetch(`/characters/${encodeURIComponent(name)}/siblings`, apiKey),
    ]);

    if (!profile) return res.status(404).json({ message: "캐릭터를 찾지 못했습니다." });

    const characters = (siblings || [])
      .filter((item) => item?.CharacterName)
      .map((item) => ({
        id: `${item.ServerName || "server"}-${item.CharacterName}`,
        name: item.CharacterName,
        server: item.ServerName || "",
        job: item.CharacterClassName || "",
        level: Number(String(item.ItemAvgLevel || "0").replace(/,/g, "")) || 0,
      }))
      .sort((a, b) => b.level - a.level);

    return res.status(200).json({ profile, characters });
  } catch (error) {
    if (error.status === 401) {
      return res.status(401).json({ message: "서버의 로스트아크 API Key가 유효하지 않습니다." });
    }
    if (error.status === 429) {
      return res.status(429).json({ message: "조회 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." });
    }
    console.error(error);
    return res.status(500).json({ message: "캐릭터 조회 중 오류가 발생했습니다." });
  }
}
