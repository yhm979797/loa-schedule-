export const RAID_DATA_UPDATED_AT = "2026-06-24";

// 레이드명/입장 레벨은 공식 로스트아크 가이드를 기준으로 정리했습니다.
// 골드는 공개 커뮤니티 자료 기반 스냅샷이며 패치 시 이 파일만 수정하면 전체 화면에 반영됩니다.
export const RAID_CATALOG = [
  { id: "belgardin-normal", group: "그림자 레이드", name: "죽음의 계율자, 벨가르딘", difficulty: "노말", minLevel: 1750, gold: 50000 },
  { id: "final-hard", group: "카제로스 레이드", name: "종막 : 최후의 날", difficulty: "하드", minLevel: 1730, gold: 0 },
  { id: "act4-hard", group: "카제로스 레이드", name: "4막 : 파멸의 성채", difficulty: "하드", minLevel: 1720, gold: 0 },
  { id: "final-normal", group: "카제로스 레이드", name: "종막 : 최후의 날", difficulty: "노말", minLevel: 1710, gold: 0 },
  { id: "act4-normal", group: "카제로스 레이드", name: "4막 : 파멸의 성채", difficulty: "노말", minLevel: 1700, gold: 0 },
  { id: "act3-hard", group: "카제로스 레이드", name: "3막 : 칠흑, 폭풍의 밤", difficulty: "하드", minLevel: 1700, gold: 0 },
  { id: "act2-hard", group: "카제로스 레이드", name: "2막 : 부유하는 악몽의 진혼곡", difficulty: "하드", minLevel: 1690, gold: 0 },
  { id: "act3-normal", group: "카제로스 레이드", name: "3막 : 칠흑, 폭풍의 밤", difficulty: "노말", minLevel: 1680, gold: 0 },
  { id: "act1-hard", group: "카제로스 레이드", name: "1막 : 대지를 부수는 업화의 궤적", difficulty: "하드", minLevel: 1680, gold: 0 },
  { id: "act2-normal", group: "카제로스 레이드", name: "2막 : 부유하는 악몽의 진혼곡", difficulty: "노말", minLevel: 1670, gold: 0 },
  { id: "act1-normal", group: "카제로스 레이드", name: "1막 : 대지를 부수는 업화의 궤적", difficulty: "노말", minLevel: 1660, gold: 0 },
  { id: "prologue-hard", group: "카제로스 레이드", name: "서막 : 붉어진 백야의 나선", difficulty: "하드", minLevel: 1640, gold: 0 },
  { id: "prologue-normal", group: "카제로스 레이드", name: "서막 : 붉어진 백야의 나선", difficulty: "노말", minLevel: 1620, gold: 0 },
];

export function getAvailableRaids(level) {
  return RAID_CATALOG.filter((raid) => Number(level) >= raid.minLevel);
}

export function makeRaidSlots(level, count = 3) {
  const available = getAvailableRaids(level).slice(0, count);
  return Array.from({ length: count }, (_, index) => {
    const raid = available[index];
    return raid
      ? { ...raid, slotId: `slot-${index + 1}`, done: false }
      : { id: "", slotId: `slot-${index + 1}`, name: "레이드 선택", difficulty: "", minLevel: 0, gold: 0, done: false };
  });
}

export function raidById(id) {
  return RAID_CATALOG.find((raid) => raid.id === id);
}
