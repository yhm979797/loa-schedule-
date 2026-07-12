import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  job: "",
  level: "",
  server: "",
  isGoldCharacter: true,
  weeklyGold: "",
};

export default function CharacterForm({
  initialValue,
  onSubmit,
  onCancel,
  submitLabel = "저장",
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(
      initialValue
        ? {
            ...initialForm,
            ...initialValue,
          }
        : initialForm
    );
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) return;

    onSubmit({
      ...form,
      name: form.name.trim(),
      job: form.job.trim(),
      server: form.server.trim(),
      level: Number(form.level) || 0,
      weeklyGold: Number(form.weeklyGold) || 0,
    });
  };

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        캐릭터명
        <input
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder="캐릭터명을 입력하세요"
          required
        />
      </label>

      <label>
        직업
        <input
          name="job"
          value={form.job}
          onChange={updateField}
          placeholder="예: 브레이커"
        />
      </label>

      <label>
        아이템 레벨
        <input
          name="level"
          type="number"
          step="0.01"
          min="0"
          value={form.level}
          onChange={updateField}
          placeholder="예: 1747"
        />
      </label>

      <label>
        서버
        <input
          name="server"
          value={form.server}
          onChange={updateField}
          placeholder="예: 루페온"
        />
      </label>

      <label>
        주간 예상 골드
        <input
          name="weeklyGold"
          type="number"
          min="0"
          value={form.weeklyGold}
          onChange={updateField}
          placeholder="0"
        />
      </label>

      <label className="checkbox-label">
        <input
          name="isGoldCharacter"
          type="checkbox"
          checked={form.isGoldCharacter}
          onChange={updateField}
        />
        골드 획득 캐릭터
      </label>

      <div className="form-actions">
        <button type="button" className="button ghost" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="button primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
