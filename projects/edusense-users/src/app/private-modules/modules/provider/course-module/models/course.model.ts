export interface CourseModel {
    course_id: number;
    title: string;
    description: string;
    slug: string;
    category_id: number;
    language_id: number;
    provider_id: number;
    is_private: number;
    unsaved_changes: number;
    cover_image: string;
    cover_image_thumb: string;
    total_duration: number;
    status: number;
    created_by: number;
    updated_by: number;
    published_date: string;
    createdAt: string;
    updatedAt: string;
    total_enrollments: number;
    course_category: CourseCategoryModel;
    language: CourseLanguageModel;
    user: CourseUserDetailModel;

    is_bookmarked: number;
}

export interface CourseCategoryModel {
    category_id: number;
    name: string;
    parent_category_id: number;
    parent_category: CourseParentCategory;
    image: string;
    image_thumb: string;
    is_active: number;
    created_by: number;
    updated_by: number;
    createdAt: string;
    updatedAt: string;
}

export interface CourseParentCategory {
    category_id: number;
    name: string;
}

export interface CourseLanguageModel {
    language_id: number;
    code: string;
    name: string;
}

export interface CourseUserDetailModel {
    user_id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    avatar_thumbnail: string;
}

export interface EnrollmentModel {
    enrollment_id: number;
}

