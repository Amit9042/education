import { MaterialGrade, MaterialSubject } from '@sharedModule/models';

export interface Users {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_role_link: UserRoleLink;
    full_name : string;
    role_name : string;
    grade: MaterialGrade[];
    subject: MaterialSubject[];
    user_master: UserMaster;
}
export interface UserRoleLink {
    role_id: number;
    is_active:number;
}

export interface UserMaster {
    first_name: string;
    last_name: string;
    email: string;
}

export interface Role {
    id: number;
    name: string;
    admin:boolean;
    applicationType: number;
    visible:boolean;
    systemDefined:boolean;
    active:boolean;
    createdAt: number;
    updatedAt: number;
}
