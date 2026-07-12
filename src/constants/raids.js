export const DEFAULT_RAIDS = [
  "카제로스 레이드 1",
  "카제로스 레이드 2",
  "에픽 레이드",
];

export const makeRaidSlots = () => DEFAULT_RAIDS.map((name, index) => ({
  id: `raid-${index + 1}`,
  name,
  done: false,
}));
