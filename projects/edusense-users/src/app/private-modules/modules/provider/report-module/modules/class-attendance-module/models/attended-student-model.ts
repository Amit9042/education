import { AssignmentUserModel } from '../../../../assignment-module/models';
import { Student } from '../../../../../../models';

export interface AttendedStudentModel {
    provider_id: number;
    class_id: number;
    session_id: number;
    is_present: number;
    absent_reason_id: number;
    remarks: string;
    duration: number;
    user_details: AssignmentUserModel;
    student_details: Student;
}
