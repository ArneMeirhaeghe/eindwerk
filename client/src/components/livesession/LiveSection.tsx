// File: src/components/livesession/LiveSection.tsx

import type { FC } from "react";
import TextInput from "./inputs/TextInput";
import Textarea from "./inputs/Textarea";
import Dropdown from "./inputs/Dropdown";
import RadioGroup from "./inputs/RadioGroup";
import CheckboxGroup from "./inputs/CheckboxGroup";
import FileUpload from "./inputs/FileUpload";
import type { FlatSection } from "../../hooks/useLiveSession";

interface Props {
  sessionId: string;
  sectionData: FlatSection;
  saved: Record<string, any>;
  onFieldSave: (
    componentId: string,
    value: any
  ) => void | Promise<void>;
  onSectionSave: (values: Record<string, any>) => void | Promise<void>;
  onUploadFile: (file: File, componentId: string) => void | Promise<void>;
}

const inputMap: Record<string, any> = {
  "text-input": TextInput,
  textarea: Textarea,
  dropdown: Dropdown,
  "radio-group": RadioGroup,
  "checkbox-group": CheckboxGroup,
  uploadzone: FileUpload,
};

const LiveSection: FC<Props> = ({
  sessionId,
  sectionData,
  saved,
  onFieldSave,
  onSectionSave,
  onUploadFile,
}) => {
  const { phase, section } = sectionData;
  const local = { ...saved };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      {section.components.map((comp) => {
        const Input = inputMap[comp.type];
        if (!Input) return null;
        const val = local[comp.id];
        const props = comp.props;
        return (
          <Input
            key={comp.id}
            {...props}
            value={val}
            values={val}
            sessionId={sessionId}
            sectionId={section.id}
            componentId={comp.id}
            files={val}
            onChange={(v: any) => onFieldSave(comp.id, v)}
            onUpload={(file: File) =>
              onUploadFile(file, comp.id)
            }
          />
        );
      })}
    </div>
  );
};

export default LiveSection;
