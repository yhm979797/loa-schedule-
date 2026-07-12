export const DAILY_TASKS = [
  { key: "chaos", label: "카오스 던전" },
  { key: "guardian", label: "가디언 토벌" },
  { key: "epona", label: "에포나 의뢰" },
];

export const WEEKLY_TASKS = [
  { key: "cube", label: "에브니 큐브" },
  { key: "raid1", label: "주간 레이드 1" },
  { key: "raid2", label: "주간 레이드 2" },
  { key: "raid3", label: "주간 레이드 3" },
];

export const createDefaultDailyTodos = () =>
  Object.fromEntries(DAILY_TASKS.map((task) => [task.key, false]));

export const createDefaultWeeklyTodos = () =>
  Object.fromEntries(WEEKLY_TASKS.map((task) => [task.key, false]));
