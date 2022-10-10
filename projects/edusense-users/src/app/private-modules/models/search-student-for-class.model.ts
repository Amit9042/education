import {StudentDetail} from '../modules/provider/student-module/models/student.model';

export interface SearchStudentForClassModel {
  request_id: number;
  student: StudentDetail;
}
