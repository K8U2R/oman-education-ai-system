export interface LessonStructure {
    title: string;
    introduction: string;
    sections: { heading: string; content: string; codeSnippet?: string }[];
    summary: string;
    quizQuestions?: { question: string; options: string[]; answer: string }[];
}
