import { Download, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import PageHeader from "../components/common/PageHeader";
import { useCharacter } from "../context/CharacterContext";

export default function Settings() {
  const {
    characters,
    settings,
    setSettings,
    clearAllData,
    importData,
  } = useCharacter();

  const fileInputRef = useRef(null);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(characters, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `loamate-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      importData(JSON.parse(text));
      window.alert("백업 데이터를 복원했습니다.");
    } catch (error) {
      window.alert(error.message || "백업 파일을 불러오지 못했습니다.");
    } finally {
      event.target.value = "";
    }
  };

  const handleClear = () => {
    if (window.confirm("모든 캐릭터 데이터를 삭제할까요?")) {
      clearAllData();
    }
  };

  return (
    <>
      <PageHeader
        title="설정"
        description="초기화 기준과 데이터를 관리하세요."
      />

      <section className="panel settings-section">
        <h2>초기화 설정</h2>

        <label>
          일일 초기화 시간
          <select
            value={settings.dailyResetHour}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                dailyResetHour: Number(event.target.value),
              }))
            }
          >
            {Array.from({ length: 24 }, (_, hour) => (
              <option key={hour} value={hour}>
                {String(hour).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </label>

        <label>
          주간 초기화 요일
          <select
            value={settings.weeklyResetDay}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                weeklyResetDay: Number(event.target.value),
              }))
            }
          >
            <option value="0">일요일</option>
            <option value="1">월요일</option>
            <option value="2">화요일</option>
            <option value="3">수요일</option>
            <option value="4">목요일</option>
            <option value="5">금요일</option>
            <option value="6">토요일</option>
          </select>
        </label>
      </section>

      <section className="panel settings-section">
        <h2>데이터 관리</h2>

        <div className="settings-actions">
          <button className="button secondary" onClick={exportData}>
            <Download size={18} />
            백업 다운로드
          </button>

          <button
            className="button secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} />
            백업 복원
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={handleImport}
          />

          <button className="button danger" onClick={handleClear}>
            <Trash2 size={18} />
            전체 데이터 삭제
          </button>
        </div>
      </section>
    </>
  );
}
