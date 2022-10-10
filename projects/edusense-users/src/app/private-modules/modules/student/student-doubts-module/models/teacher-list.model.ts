export interface TeacherListModel {
    class_id: number
    class_user_link: TeacherDetail;
    student_class_detail: {
        provider_id: number;
    }
}

export interface TeacherDetail {
    user_id: number;
    user_master_detail: UserMasterDetail;
    provider_id?: number;
    name?: string;
}

export interface UserMasterDetail {
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    avatar_thumbnail: string;
}
