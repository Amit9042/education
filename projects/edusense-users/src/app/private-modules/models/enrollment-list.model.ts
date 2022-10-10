import { City } from './city.model';
import { State } from './state.model';
import { Country } from './country.model';

export interface EnrollmentListModel {
    request_id: number;
    enrollment_status: number;
    created_at: string;
    student: Student;
    user_details: UserDetail;
    student_class_link: StudentClassLink;
}

export interface Student {
    user_id: number;
    school_name: string;
    student_grade: GradeDetail;
    student_city: City;
    student_state: State;
    student_country: Country;
}

export interface GradeDetail {
    grade_id: number;
    alias: string;
}

export interface UserDetail {
    first_name: string;
    last_name: string;
    email: string;
    avatar_thumbnail: string;
    dial_code: string;
    contact_number: string;
}

export interface StudentClassLink {
    class_id: number;
    student_class_detail: ClassDetail;
}

export interface ClassDetail {
    class_id: number;
    name: string;
}
