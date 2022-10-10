import { ClassDetail, User } from '../../../../models';

export interface AssignmentModel {
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
    student_assignment: number;
}
