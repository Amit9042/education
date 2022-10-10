export interface StudentQuestionModel {
    questionId: number;
    practiceId: number;
    chapterId: number;
    gradeId: number;
    subjectId: number;
    question: string;
    type: number;
    solution: string;
    solutionImage: ImageModel[];
    difficulty: string;
    showSolution: boolean;
    score: number;
    multiAnswer: boolean;
    partialCredit: boolean;
    active: boolean;
    questionImage: ImageModel[];
    questionAnswer: QuestionAnswerModel[];
    currectAnswerIds: any[];
    questionBookmarked: boolean;
    selectedAnswerIds: any[];
}

export interface ImageModel {
    id: number;
    name: string;
    url: string;
}

export interface QuestionAnswerModel {
    answerId: number;
    questionId: number;
    content: string;
    correct: boolean;
    active: boolean;
    images: ImageModel[];
}
