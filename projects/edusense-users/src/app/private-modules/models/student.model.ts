import {City} from './city.model';
import {State} from './state.model';
import {Country} from './country.model';

export interface StudentModel {
  user_id: number;
  school_name: string;
  student_city: City;
  student_state: State;
  student_country: Country;
  gender: number;
}
