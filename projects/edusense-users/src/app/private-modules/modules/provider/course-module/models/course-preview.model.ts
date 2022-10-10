import { StudentLectureModel } from "../../../student/student-course-module/models/course-detail.model";

export interface CoursePreviewModel {
    section_id: number;
    temp_sequence_no: number;
    title: string;
    total_lectures: number;
    total_lecture_duration: number;
    createdAt: string;
    updatedAt: string;
    lectures: CourseLecturesModel[];
    sequence_no: number;
    completedCourse: number;
}

export interface CourseLecturesModel {
    lecture_id: number;
    section_id: number;
    temp_sequence_no: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    lecture_content: LectureContentModel;
    resources: LectureResourcesModel[];

    sequence_no: number;
    student_lecture: StudentLectureModel;
}

export interface LectureContentModel {
    id: number;
    description: string;
    content_preview: string;
    content_size: number;
    content_extension: string;
    content_mime_type: string;
    content_path: string;
    content_duration: number;
    content_type: number;
    duration: string;
    createdAt: string;
    updatedAt: string;
}

export interface LectureResourcesModel {
    resource_id: number;
    title: string;
    content_size: number;
    content_path: string;
    content_extension: string;
    content_mime_type: string;
    content_duration: number;
    content_type: number;
    createdAt: string;
    updatedAt: string;
}
