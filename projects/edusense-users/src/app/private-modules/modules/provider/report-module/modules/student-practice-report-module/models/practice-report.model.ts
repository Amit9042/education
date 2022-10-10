export interface PracticeReportModel {
    id: number;
    userId: number;
    userName: string;
    contactNumber: string;
    gradeId: number;
    gradeName: string;
    gradeAlias: string;
    subjectId: number;
    subjectName: string;
    practiceId: number;
    practiceName: string;
    finishedAt: number;
    totalMarks: number;
    obtainMarks: number;
}
