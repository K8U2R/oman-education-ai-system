import React from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/common/Tabs/Tabs'
import { BookOpen, Code, FileText } from 'lucide-react'
import { MarkdownViewer } from './editor/MarkdownViewer'
import { CodeEditor } from './editor/CodeEditor'

interface WorkspacePanelProps {
  explanation: string
  codeContext?: string
  isStreaming: boolean
}

export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({
  explanation,
  codeContext,
  isStreaming,
}) => {
  return (
    <div className="h-full bg-background/50 flex flex-col">
      <Tabs defaultValue="explanation" className="flex-1 flex flex-col">
        <div className="border-b border-border px-4 pt-2">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger value="explanation" className="data-[state=active]:bg-background">
              <BookOpen className="w-4 h-4 mr-2" />
              الشرح
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-background">
              <Code className="w-4 h-4 mr-2" />
              المختبر (Code)
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="explanation" className="flex-1 overflow-auto p-0 m-0">
          {explanation ? (
            <MarkdownViewer content={explanation} isStreaming={isStreaming} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>ابدأ المحادثة لترى الشرح هنا</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="code" className="flex-1 overflow-hidden p-0 m-0 h-full">
          <CodeEditor code={codeContext || '# سيظهر الكود هنا عند طلبه...'} readOnly={false} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
