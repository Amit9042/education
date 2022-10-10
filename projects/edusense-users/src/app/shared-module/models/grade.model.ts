import { SubjectListModel } from '../../public-modules/models/provider';
export interface Grade {
    grade_id: number;
    name: string;
    description: string;
    is_active: number;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    alias: string;
}

export interface MaterialGrade {
    grade_id: number;
    grade: Grade;
    name: string;
}

export interface MaterialSubject {
    subject_id: number;
    name: string;
    alias: string;
    logo: string;
    description: string;
    material_count: number;
}
