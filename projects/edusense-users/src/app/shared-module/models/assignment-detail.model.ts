export interface AssignmentDetailModel {
    assignment_id: number;
    provider_id: number;
    title: string;
    instruction: string;
    start_date: string;
    submission_date: string;
    createdAt: string;
    class: AssignmentClassModel;
    createdBy: AssignmentUserModel;
    provider_assignment_attachments: ProviderAssignmentAttachmentsModel[];
    subjects: AssignmentSubjectModel[];
  created_by: number;
}

export interface AssignmentClassModel {
    class_id: number;
    name: string;
}

export interface AssignmentUserModel {
    user_id: number;
    first_name: string;
    last_name: string;
}

export interface ProviderAssignmentAttachmentsModel {
    attachment_id: number;
    file_name: string;
    file_path: string;
    file_content_type: string;
    file_extension: string;
    createdAt: string;
}

export interface AssignmentSubjectModel {
    subject_id: number;
    name: string;
}
