import { Grade } from '@sharedModule/models';
import { SubjectListModel } from '../../profile-details-module/models';

export interface Material {
    material_id: number;
    material_type_id: number;
    grade_id: number;
    subject_id: number;
    provider_id: number;
    name: string;
    original_file_name: string;
    file_path: string;
    file_content_type: string;
    file_extension: string;
    is_active: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    provider_material_grade_detail: ProviderMaterialGradeDetail;
    provider_material_subject_detail: ProviderMaterialSubjectDetail;
    selectedSubjects: SubjectListModel;
    selectedGrades: Grade;
}
interface ProviderMaterialSubjectDetail {
    subject_id: number;
    name: string;
    description: string;
    is_active: number;
}

interface ProviderMaterialGradeDetail {
    grade_id: number;
    name: string;
    description: string;
    is_active: number;
}
