export interface RecordingSessionModel {
    class_id: number;
    recording_id: number;
    recording_path: string;
    content_type: string;
    created_by: number;
    created_at: string;
    title: string;
    is_active: number;
    class_map_details: ClassMapDetails[];
    teacher_map_details: [{ user_details: User; user_id: number }];
    grade_master: {
        name: string;
        alias: string;
        grade_id: number;
    };
    subject_master: {
        name: string;
        subject_id: number;
    };
    grade_details: Grade;
    subject_details: Subject;
    class_details: {
        class_id: number;
        name: string;
        grade: Grade[];
        subjects: Subject[];
    };
    user: User;
}

export interface ClassMapDetails {
    class_id: number;
    class: ClassDetails;
}

export interface ClassDetails {
    class_id: number;
    name: string;
}

export interface Grade {
    grade_id: number;
    grade_master: {
        name: string;
    };
}

export interface Subject {
    subject_id: number;
    subject_master: {
        name: string;
        description: string;
    };
}

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
}
