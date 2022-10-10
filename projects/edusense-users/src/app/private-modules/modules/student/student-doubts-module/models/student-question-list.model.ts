
export interface StudentQuestionListModel {
    _id: string;
    images: ImageData;
    bookmarked: [];
    comments: [];
    subject_id: Subject;
    question: string;
    created_at: string;
    totalAns: number;
    isBookmarked: boolean;
}

export interface ImageData {
    url?: string;
    description?: string;
    resolution?: string;
}

export interface Subject {
    id: string;
    name: string;
}
