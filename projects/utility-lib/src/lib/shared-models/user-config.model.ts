export interface Provider {
  provider_id: number;
  provider_code: string;
  name: string;
}

export interface UserConfigModel extends UserModel {
  app_id: number;
  email: string;
  dial_code_country_id: number;
  dial_code: string;
  contact_number: number;
  avatar: string;
  is_mobile_verified: number;
  is_email_verified: number;
  has_accepted_tnc: number;
  is_profile_completed: number;
  gender: string;
  grade_id: string;
  school_name: string;
  provider_list: Provider[];
  user_id: number;
  user_uuid: string;
}

export interface UserModel {
  user_id: number;
  first_name: string;
  last_name: string;
  avatar_thumbnail: string;
}
