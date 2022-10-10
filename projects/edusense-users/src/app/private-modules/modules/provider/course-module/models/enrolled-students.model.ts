export interface EnrolledStudentsModel {
    enrollment_id: number;
    course_progress: number;
    is_completed: number;
    createdAt: string;
    updatedAt: string;
    user: EnrolledStudentUserModel;
}

export interface EnrolledStudentUserModel {
    user_id: number;
    student_name: string;
    email: string;
}
