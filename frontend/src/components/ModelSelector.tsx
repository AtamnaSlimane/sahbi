import type { OllamaModel } from "../types";

interface Props {
  models: OllamaModel[];
  selected: string;
  onChange: (model: string) => void;
}

export default function ModelSelector({ models, selected, onChange }: Props) {
  return (
    <select
      className="model-selector"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
    >
      {models.map((m) => (
        <option key={m.name} value={m.name}>
          {m.name}
        </option>
      ))}
    </select>
  );
}
