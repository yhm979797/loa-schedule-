export async function searchRoster(name) {
  const response = await fetch(`/api/lostark?name=${encodeURIComponent(name.trim())}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "캐릭터 조회에 실패했습니다.");
  return data;
}
