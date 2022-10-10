export interface ProviderPracticeModel {
    id: number;
    gradeId: number;
    subjectId: number;
    name: string;
    description: string;
    maxQuestion: number;
    published: boolean;
    publishedAt: number;
    chapterIds: any[];
    addedQuestion: number;
    chapterName: string;
    chapterMasterId: number;
}
