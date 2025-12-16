import React, { useState } from 'react';
import { Edit, Bold, Italic, Underline, List, AlignRight, AlignLeft, Heading } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface WordEditorProps {
  content: string;
  onChange: (content: string) => void;
  onEdit: (request: string) => void;
}

const WordEditor: React.FC<WordEditorProps> = ({ content, onChange, onEdit }) => {
  const [editRequest, setEditRequest] = useState('');

  const handleEditRequest = () => {
    if (editRequest.trim()) {
      onEdit(editRequest);
      setEditRequest('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm">
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Underline className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-ide-border" />
          <Button variant="ghost" size="sm">
            <Heading className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <List className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-ide-border" />
          <Button variant="ghost" size="sm">
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <AlignLeft className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Editor */}
      <Card>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">محتوى المستند</label>
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-96 p-4 rounded-md bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent font-mono text-sm"
            placeholder="ابدأ الكتابة أو استخدم AI لإنشاء المحتوى..."
          />
        </div>
      </Card>

      {/* AI Edit Request */}
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Edit className="w-4 h-4 text-ide-accent" />
          <label className="text-sm font-medium">طلب تعديل من AI</label>
        </div>
        <div className="flex gap-2">
          <Input
            value={editRequest}
            onChange={(e) => setEditRequest(e.target.value)}
            placeholder="مثال: أضف فقرة عن الذكاء الاصطناعي في البداية"
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleEditRequest();
              }
            }}
          />
          <Button onClick={handleEditRequest} disabled={!editRequest.trim()}>
            <Edit className="w-4 h-4" />
            تطبيق
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WordEditor;

