export interface AssignmentSubmissionModel {
  id: number;
  user: AssignmentUserModel;
  student_assignment: StudentAssignmentModel;
}

export interface AssignmentUserModel {
  user_id: number;
  student_name: string;
  avatar: string;
  avatar_thumbnail: string;
}

export interface StudentAssignmentModel {
  student_assignment_id: number;
  assignment_id: number;
  check_status: number;
  created_at: string;
}
