export interface DoubtList {
_id: string;
bookmarked: [number]
subject_id: DoubtListSubject;
grade_id: DoubtListGrade;
question: string;
from_user_id: number;
from_user_obj: DoubtListUserObj;
images: DoubtListImage[]
created_at: string;
comments: DoubtListComment[]
totalAns: number;
isBookmarked: boolean;
}

export interface DoubtListSubject {
    _id: string;
    subject_id: number;
    name: string;
    logo: string;
}

export interface DoubtListGrade {
    _id: string;
    grade_id: number;
    name: string;
    alias: string;
}

export interface DoubtListUserObj {
    _id: string;
    first_name: string;
    last_name: string;
    user_id: number;
    avatar_thumbnail: string;
    role_id: number;
}

export interface DoubtListImage {
    _id: string;
    description: string;
    resolution: string;
    url: string;
}

export interface DoubtListComment {
    is_deleted: boolean;
    accept_answer: boolean;
    _id: string;
    user_id: string;
    description: string;
    images: DoubtListImage[]
    created_at: string;
}
