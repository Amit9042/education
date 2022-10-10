export interface ClassAttendanceModel {
    session_id: number;
    session_started_at: string;
    session_ended_at: string;
    created_by: number;
    session_running_status: number;
    duration: number;
    class_id: number;
    provider_id: number;
    class_name: string;
    user_id: number;
    teacher_name: string;
    total_student: number;
    present_student: number;
    absent_student: number;
    teacher_avatar: string;
    teacher_avatar_thumbnail: string;
}
