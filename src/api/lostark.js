const BASE_URL = "https://developer-lostark.game.onstove.com";

function headers() {
  const token = import.meta.env.VITE_LOSTARK_API_KEY;
  if (!token) {
    throw new Error("VITE_LOSTARK_API_KEY가 설정되지 않았습니다.");
  }
  return {
    accept: "application/json",
    authorization: `bearer ${token}`,
  };
}

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`, { headers: headers() });
  if (!response.ok) {
    if (response.status === 401) throw new Error("로스트아크 API 토큰을 확인해 주세요.");
    if (response.status === 404) throw new Error("캐릭터를 찾지 못했습니다.");
    throw new Error(`로스트아크 API 오류: ${response.status}`);
  }
  return response.json();
}

export async function getCharacterProfile(name) {
  return request(`/armories/characters/${encodeURIComponent(name)}/profiles`);
}

export async function getSiblings(name) {
  return request(`/characters/${encodeURIComponent(name)}/siblings`);
}

export async function searchRoster(name) {
  const [profile, siblings] = await Promise.all([
    getCharacterProfile(name),
    getSiblings(name),
  ]);

  const normalized = (siblings || [])
    .filter((item) => item.CharacterName)
    .map((item) => ({
      id: `${item.ServerName}-${item.CharacterName}`,
      name: item.CharacterName,
      server: item.ServerName || "",
      job: item.CharacterClassName || "",
      level: Number(String(item.ItemAvgLevel || "0").replace(/,/g, "")) || 0,
      goldCharacter: false,
    }))
    .sort((a, b) => b.level - a.level);

  return {
    profile,
    characters: normalized,
  };
}
