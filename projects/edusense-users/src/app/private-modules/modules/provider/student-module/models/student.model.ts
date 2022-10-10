import { ParentClasses } from '@sharedModule/models';

export interface Student {
    class_id: number;
    request_id: number;
    user_id: number;
    provider_id: number;
    enrollment_status: number;
    is_removed: number;
    updated_by: string;
    created_at: string;
    updated_at: string;
    student_class_link: StudentClassLink;
    student: StudentDetail;
    isSelected: boolean;
    gender:string;
    grade_id:string;
    school_name: string;
    user_details: User;
    student_city: StudentCity;
    student_state: StudentState;
    student_country: StudentCountry;
}

interface StudentClassLink {
    user_id: number;
    Student_detail: StudentDetail;
}

export interface StudentDetail {
    user_id: number;
    school_name: string;
    user: User;
    user_details: User;
    student_city: StudentCity;
    student_state: StudentState;
    student_grade: StudentGrade;
    student_country: StudentCountry;
    class: Class[];
    parent_class: ParentClasses[];
    classNames: string[];
}

interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    avatar_thumbnail: string;
    user_uuid: string;
}

interface StudentCity {
    city_id: number;
    city_name: string;
}

interface StudentState {
    state_id: number;
    state_name: string;
}

interface StudentCountry {
    country_id: number;
    country_name: string;
}

interface StudentGrade {
    grade_id: number;
    name: string;
}

interface Class {
    class_id: number;
    name: string;
}
