export interface UserModel {
  email: string;
  fname: string;
  gender: number;
  is_profile_completed: number;
  lname: string;
  mobile: string;
  profile_image_path: string;
  user_id: number;
  ExpertDetails: ExpertDetails;
  CityDetails: CityDetails;
  dob: string;
}

export interface ExpertDetails {}

export interface CityDetails {
  city_id: number;
  name: string;
  StateDetails: StateDetailsModel;
}

export interface StateDetailsModel {
  state_id: number;
  name: string;
}

export interface ModulesModel {
  id: number;
  name: string;
  active: boolean;
}
