import React, { useState } from 'react';
import { Code, Type } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const EditorSettings: React.FC = () => {
  const { showSuccess } = useErrorHandler();
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Fira Code');
  const [tabSize, setTabSize] = useState(2);
  const [wordWrap, setWordWrap] = useState(true);
  const [minimap, setMinimap] = useState(false);

  const handleSave = async () => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    showSuccess('تم الحفظ', 'تم حفظ إعدادات المحرر بنجاح');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-ide-accent" />
          إعدادات المحرر
        </h2>
        <div className="space-y-4">
          <Input
            label="حجم الخط"
            type="number"
            value={fontSize.toString()}
            onChange={(e) => setFontSize(Number(e.target.value))}
            leftIcon={<Type className="w-4 h-4" />}
          />
          <Select
            label="نوع الخط"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            options={[
              { value: 'Fira Code', label: 'Fira Code' },
              { value: 'Consolas', label: 'Consolas' },
              { value: 'Monaco', label: 'Monaco' },
            ]}
          />
          <Input
            label="حجم Tab"
            type="number"
            value={tabSize.toString()}
            onChange={(e) => setTabSize(Number(e.target.value))}
          />
          <Checkbox
            label="تفعيل Word Wrap"
            checked={wordWrap}
            onChange={(e) => setWordWrap(e.target.checked)}
          />
          <Checkbox
            label="إظهار Minimap"
            checked={minimap}
            onChange={(e) => setMinimap(e.target.checked)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>حفظ</Button>
      </div>
    </div>
  );
};

export default EditorSettings;

