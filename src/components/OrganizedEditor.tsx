import type { NoteCategory, OrganizedNotes } from "../types";

const categoryMeta: { key: NoteCategory; label: string; placeholder: string }[] = [
  { key: "plans", label: "计划", placeholder: "准备做什么" },
  { key: "wins", label: "收获", placeholder: "学到或发现了什么" },
  { key: "blocks", label: "阻碍", placeholder: "哪里卡住了" },
  { key: "nextSteps", label: "下一步", placeholder: "接下来最小的动作" },
  { key: "unclassified", label: "待整理", placeholder: "暂时无法归类" }
];

interface OrganizedEditorProps {
  value: OrganizedNotes;
  onChange: (value: OrganizedNotes) => void;
}

export function OrganizedEditor({ value, onChange }: OrganizedEditorProps) {
  return (
    <div className="organized-grid">
      {categoryMeta.map(({ key, label, placeholder }) => (
        <label className={`organized-field organized-${key}`} key={key}>
          <span>{label}</span>
          <textarea
            value={value[key].join("\n")}
            placeholder={placeholder}
            rows={Math.max(2, value[key].length)}
            onChange={(event) =>
              onChange({
                ...value,
                [key]: event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .slice(0, 5)
              })
            }
          />
        </label>
      ))}
    </div>
  );
}
