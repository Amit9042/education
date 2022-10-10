export interface DoubtGradeModel {
    grade_id: number;
    grade: DoubtGrade;
}

export interface DoubtGrade {
    grade_id: number;
    name: string;
    alias: string;
    description: null;
    is_active: number;
}
