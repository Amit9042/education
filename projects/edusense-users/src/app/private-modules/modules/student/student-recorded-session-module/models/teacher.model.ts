export interface Teacher {
    user_id: number;
    role_id: number;
    fullName: string;
    user_details: UserDetails;
}

export interface UserDetails {
    first_name: string;
    last_name: string;
}
