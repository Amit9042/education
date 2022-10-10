import { SubjectListModel } from '../../public-modules/models/provider';
import { Grade } from './grade.model';
import { Users } from '../../private-modules/modules/provider/user-management-module/models';
import { MaterialGrade, MaterialSubject, ParentClasses } from '@sharedModule/models';

export interface Classes {
    class_id: number;
    provider_id: number;
    parent_class_id: number;
    name: string;
    uuid: string;
    is_active: number;
    created_at: string;
    updated_at: string;
    grade: Grades[];
    session_details: {
        session_running_status: number;
    };
    gradeName: string[];
    start_time: string;
    end_time: string;
    description: string;
    timezone_id: number;
    days: Days[];
    days_id: number[];
    days_name: string[];
    subjects: Subjects[];
    timezone: Timezone;
    selectedGrades: Grade[];
    selectedSubjects: SubjectListModel[];
    selectedGrade: MaterialGrade;
    selectedSubject: MaterialSubject;
    provider_detail: ProviderDetail;
    teacher_ids: number[];
    class_user_link: ClassUserLink[];
    teacherName: string[];
    selectedTeacher: Users;
    parent_class_detail: ParentClassDetail;
    selectedParentClass: ParentClasses;
}

interface ParentClassDetail {
    class_name: string;
}
export interface ClassUserLink {
    user_id: number;
    user_master_detail: UserMasterDetail;
}

interface UserMasterDetail {
    first_name: string;
    last_name: string;
    user_role: UserRole;
}

interface UserRole {
    role_id: number;
}
interface Timezone {
    name: string;
}
export interface Subjects {
    subject_id: number;
    subject_master: SubjectMaster;
}
interface SubjectMaster {
    name: string;
    description: string;
}
interface Days {
    day: number;
}
export interface Grades {
    grade_id: number;
    grade_master: GradeMaster;
}

interface GradeMaster {
    name: string;
    alias: string;
}

interface ProviderDetail {
    provider_first_name: string;
    provider_last_name: string;
    logo_thumbnail: string;
}
