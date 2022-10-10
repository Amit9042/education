export interface ProfileDetailModel {
    user_id: number;
    gender: string;
    grade_id: number;
    school_name: string;
    country_id: number;
    state_id: number;
    city_id: number;
    created_at: string;
    updated_at: string;
    user_details: UserDetail;
    grade: GradeDetail;
    city: CityDetail;
    state: StateDetail;
    country: CountryDetail;
}

export interface UserDetail {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    dial_code_country_id: number;
    dial_code: string;
    contact_number: string;
    avatar: string;
    avatar_thumbnail: string;
    is_mobile_verified: number;
    is_email_verified: number;
    has_accepted_tnc: number;
    is_profile_completed: number;
    created_at: string;
    updated_at: string;
    createdAt: string;
    updatedAt: string;
}

export interface GradeDetail {
    grade_id: number;
    name: string;
    description: string;
    is_active: number;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

export interface CountryDetail {
    country_id: number;
    country_name: string;
    code: string;
    dial_code: string;
    is_active: number;
}

export interface StateDetail {
    state_id: number;
    state_name: string;
    country_id: number;
}

export interface CityDetail {
    city_id: number;
    city_name: string;
    state_id: number;
    country_id: number;
    is_user_defined: number;
}
