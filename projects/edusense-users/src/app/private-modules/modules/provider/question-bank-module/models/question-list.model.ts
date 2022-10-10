export interface QuestionListModel {
    questionId: number;
    chapterId: number;
    gradeId: number;
    subjectId: number;
    question: string;
    type: number;
    solution: string;
    difficulty: string;
    showSolution: boolean;
    score: number;
    multiAnswer: boolean;
    partialCredit: boolean;
    active: boolean;
    questionImage?: {
        id: string;
    };
    questionAnswer: QuestionAnswerModel[];
}

export interface QuestionAnswerModel {
    answerId: number;
    questionId: number;
    content: string;
    correct: boolean;
    active: boolean;
    optionImage?: {
        id: string;
    };
}
