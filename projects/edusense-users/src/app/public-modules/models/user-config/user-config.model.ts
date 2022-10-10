import {UserTypeEnum} from '@sharedModule/constants';

export interface Provider {
  provider_id: number;
  provider_code: string;
  name: string;
}

export interface UserConfigModel extends UserModel {
  app_id: UserTypeEnum;
  email: string;
  dial_code_country_id: number;
  dial_code: string;
  contact_number: 9408580801;
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
  enterprise?: EnterpriseDetail[];
  public_base_url: string;
}

export interface UserModel {
  user_id: number;
  first_name: string;
  last_name: string;
  avatar_thumbnail: string;
  user_uuid:string;
}

export interface EnterpriseDetail {
  jointime: string;
  provider_id: number;
  provider_uuid: string;
  provider_name: string;
  logo: string;
  logo_thumbnail: string;
  avatar: string;
  avatar_thumbnail: string;
  provider_code: string;
  provider_type: string;
}
