export interface GradeModel {
    class_id: number;
    class_grade_list: GradeList;
    name?: string;
}

export interface GradeList {
    grade_id: number;
    grade_master: GradeMaster;
}

export interface GradeMaster {
    name: string;
    alias: string;
}
