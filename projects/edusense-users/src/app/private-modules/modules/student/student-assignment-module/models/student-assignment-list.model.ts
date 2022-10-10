import { ClassDetail, User } from '../../../../models';

export interface StudentAssignmentListModel {
    assignment_id: number;
    provider_id: number;
    title: string;
    instruction: string;
    start_date: string;
    submission_date: string;
    createdAt: string;
    class: ClassDetail;
    createdBy: User;
    provider_assignment_attachments: number;
    student_assignment: StudentSubmittedAssignmentDetails;
}

export interface StudentSubmittedAssignmentDetails {
    student_assignment_id: number;
    user_id: number;
    check_status: number;
    createdAt: string;
}
