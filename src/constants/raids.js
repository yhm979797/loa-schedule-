export const RAID_DATA_UPDATED_AT = "2026-07-12 (클리어 골드 교정)";

// 레이드 데이터는 한 파일에서만 관리합니다.
// 골드는 관문 합계 클리어 골드이며, 캐릭터 레벨 이상인 항목만 선택 목록에 표시됩니다.
export const RAID_CATALOG = [
  { id: "belgardin-normal", group: "그림자 레이드", name: "죽음의 계율자, 벨가르딘", shortName: "벨가르딘", difficulty: "노말", minLevel: 1750, gold: 50000 },

  { id: "cathedral-3", group: "어비스 던전", name: "지평의 성당", shortName: "지평의 성당", difficulty: "3단계", minLevel: 1750, gold: 50000 },
  { id: "cathedral-2", group: "어비스 던전", name: "지평의 성당", shortName: "지평의 성당", difficulty: "2단계", minLevel: 1720, gold: 40000 },
  { id: "cathedral-1", group: "어비스 던전", name: "지평의 성당", shortName: "지평의 성당", difficulty: "1단계", minLevel: 1700, gold: 30000 },

  { id: "serka-nightmare", group: "그림자 레이드", name: "고통의 마녀, 세르카", shortName: "세르카", difficulty: "나이트메어", minLevel: 1740, gold: 54000 },
  { id: "serka-hard", group: "그림자 레이드", name: "고통의 마녀, 세르카", shortName: "세르카", difficulty: "하드", minLevel: 1730, gold: 44000 },
  { id: "serka-normal", group: "그림자 레이드", name: "고통의 마녀, 세르카", shortName: "세르카", difficulty: "노말", minLevel: 1710, gold: 32000 },

  { id: "final-hard", group: "카제로스 레이드", name: "종막 : 최후의 날", shortName: "종막", difficulty: "하드", minLevel: 1730, gold: 48000 },
  { id: "final-normal", group: "카제로스 레이드", name: "종막 : 최후의 날", shortName: "종막", difficulty: "노말", minLevel: 1710, gold: 32000 },

  { id: "act4-hard", group: "카제로스 레이드", name: "4막 : 파멸의 성채", shortName: "4막", difficulty: "하드", minLevel: 1720, gold: 38000 },
  { id: "act4-normal", group: "카제로스 레이드", name: "4막 : 파멸의 성채", shortName: "4막", difficulty: "노말", minLevel: 1700, gold: 27000 },

  { id: "act2-hard", group: "카제로스 레이드", name: "2막 : 부유하는 악몽의 진혼곡", shortName: "2막", difficulty: "하드", minLevel: 1690, gold: 23000 },
  { id: "act2-normal", group: "카제로스 레이드", name: "2막 : 부유하는 악몽의 진혼곡", shortName: "2막", difficulty: "노말", minLevel: 1670, gold: 16500 },
];

export function getAvailableRaids(level) {
  return RAID_CATALOG
    .filter((raid) => Number(level) >= raid.minLevel)
    .sort((a, b) => b.minLevel - a.minLevel || b.gold - a.gold);
}

export function makeRaidSlots(level, count = 3) {
  const available = getAvailableRaids(level);
  const picked = [];
  const usedGroups = new Set();

  for (const raid of available) {
    const uniqueKey = raid.name;
    if (usedGroups.has(uniqueKey)) continue;
    picked.push(raid);
    usedGroups.add(uniqueKey);
    if (picked.length === count) break;
  }

  return Array.from({ length: count }, (_, index) => {
    const raid = picked[index];
    return raid
      ? { ...raid, slotId: `slot-${index + 1}`, done: false }
      : { id: "", slotId: `slot-${index + 1}`, name: "레이드 선택", shortName: "레이드 선택", difficulty: "", minLevel: 0, gold: 0, done: false };
  });
}

export function raidById(id) {
  return RAID_CATALOG.find((raid) => raid.id === id);
}
