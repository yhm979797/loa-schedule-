export const DAILY_TASKS = [
  { key: "chaos", label: "카오스 던전" },
  { key: "guardian", label: "가디언 토벌" },
];

export const WEEKLY_TASKS = [
  { key: "kurzan", label: "쿠르잔 전선" },
  { key: "kazeros", label: "카제로스 전장" },
  { key: "guild", label: "길드 의뢰" },
];

export const ALL_TASKS = [...DAILY_TASKS, ...WEEKLY_TASKS];

export const emptyTasks = () =>
  Object.fromEntries(ALL_TASKS.map((task) => [task.key, false]));
