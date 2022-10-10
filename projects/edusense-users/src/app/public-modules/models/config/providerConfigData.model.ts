export interface ProviderConfigDataModel {
    app_id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    dial_code_country_id: null;
    dial_code: null;
    contact_number: null;
    avatar: null;
    is_mobile_verified: number;
    is_email_verified: number;
    has_accepted_tnc: number;
    is_profile_completed: number;
    provider_list: ProviderList[];
    provider_id: number;
    name: string;
}

export interface ProviderList {
    provider_id: number;
    name: string;
}
