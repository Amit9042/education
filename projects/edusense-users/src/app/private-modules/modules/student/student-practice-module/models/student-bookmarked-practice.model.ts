export interface StudentBookmarkedPracticeModel {
    id: number;
    gradeId: number;
    subjectId: number;
    name: string;
    description: string;
    maxQuestion: number;
    published: boolean;
    publishedAt: number;
    chapterIds: number[];
}
