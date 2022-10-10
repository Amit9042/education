import {UserModel} from '../../public-modules/models';
import {StudentModel} from './student.model';

export class EnrollmentStudentModel {
  provider_id: number;
  enrollment_status: number;
  created_at: string;
  provider: {
    name: string;
    logo_thumbnail: string;
    provider_first_name: string;
    provider_last_name: string;
    provider_code: string;
    provider_type: {
      provider_type: string;
      provider_type_id: number
    };
  };
}

export class StudentEnrolReqModel {
  request_id: number;
  enrollment_status: number;
  student: StudentModel;
  user_details: UserModel;
}
