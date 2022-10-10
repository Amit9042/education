import { UserModel } from '../../public-modules/models';
import { City } from './city.model';
import { State } from './state.model';
import { Country } from './country.model';

export interface ClassStudentsModel {
    id: number;
    parent_class_student_link: Studnet;
    Student_detail: Studnet;
    isSelected: boolean;
}
interface Studnet {
    school_name: null;
    gender: null;
    student_city: City;
    student_state: State;
    student_country: Country;
    user: UserModel;
}
