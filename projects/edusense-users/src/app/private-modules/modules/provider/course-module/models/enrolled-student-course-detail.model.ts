export interface EnrolledStudentCourseDetailModel {
    lectures: lectureStudentStatusModel[];
}

export interface lectureStudentStatusModel {
    section_id: number;
    title: string;
    total_lectures: number;
    student_lecture_section: StudentLectureSectionModel;
    lectures: lecturesModel[];
}

export interface lecturesModel {
    lecture_id: number;
    sequence_no: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    student_lecture: studentLectureModel;
}

export interface StudentLectureSectionModel {
    id: number;
    start_date: string;
    end_date: string;
    is_completed: number;
}

export interface studentLectureModel {
    lecture_progress: number;
    is_completed: number;
    created_at: string;
    updated_at: string;
}
