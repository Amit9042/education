import { DoubtListSubject, DoubtListImage, DoubtListComment } from './student-all-doubt-list';

export interface StudentYourDoubtList {
    _id: string;
    bookmarked: [number];
    subject_id: DoubtListSubject;
    question: string;
    images: DoubtListImage[]
    created_at: string;
    comments: DoubtListComment[]
    totalAns: number;
    isBookmarked: boolean;
}
