import { CourseModel, CoursePreviewModel } from "../../../provider/course-module/models";

export interface CourseDetail {
    course: CourseModel;
    sections: CoursePreviewModel[];
};

export interface StudentLectureModel {
    id: number;
    lecture_progress: number;
    is_completed: number;
    start_date;
    end_date;
}
