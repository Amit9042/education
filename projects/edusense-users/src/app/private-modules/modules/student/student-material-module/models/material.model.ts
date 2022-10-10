
export interface Material {
    material_id: number;
    grade_id: number;
    subject_id: number;
    provider_id: number;
    material_type_id: number;
    name: string;
    original_file_name: string;
    file_path: string;
    file_content_type: string;
    file_extension: string;
    is_active: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    grade_name: string;
    subject_name: string;
    // selectedSubjects: SubjectListModel;
    // selectedGrades: Grade;
}

export interface MaterialSubject {
    subject_id: number;
    name: string;
    description: string;
    material_count: number;
    logo: string;
}
