export interface SubjectModel {
    class_id: number;
    class_subject_link: ClassSubject;
}

export interface ClassSubject {
    subject_id: number;
    subject_master: SubjectMaster;
}

export interface SubjectMaster {
    name: string;
    description: string;
    logo: string;
}
