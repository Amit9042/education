import {
    AssignmentDetailModel,
    AssignmentSubjectModel
} from '@sharedModule/models/index';

export interface SubmittedAssignmentModel {
    student_assignment_id: number;
    description: string;
    check_status: number;
    checked_at: string;
    checked_by: number;
    complete_percentage: number;
    remarks: string;
    createdAt: string;
    user: SubmittedAssignmentUserModel;
    student_assignment_attachments: SubmissionUserAttachmentModel[];
    provider_assignment: AssignmentDetailModel;
    subjects: AssignmentSubjectModel[];
    created_at: string;
}

export interface SubmittedAssignmentUserModel {
    user_id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    avatar_thumbnail: string;
}

export interface SubmissionUserAttachmentModel {
    student_attachment_id: number;
    file_name: string;
    file_path: string;
    file_content_type: string;
    file_extension: string;
    createdAt: string;
}
