export class RouteConstant {
    // Common constant
    public static readonly ADD = 'add';
    public static readonly EDIT = 'edit';
    public static readonly VIEW = 'view';
    public static readonly LIST = 'list';

    public static readonly COMING_SOON_ROUTE = 'coming-soon';

    public static readonly SET_PASSWORD = 'set-password';

    public static readonly PROVIDER_DASHBOARD_MODULE_ROUTE =
        'provider-dashboard';
    public static readonly STUDENT_DASHBOARD_MODULE_ROUTE = 'student-dashboard';
    public static readonly STUDENT_MODULE_ROUTE = 'student';
    public static readonly PROVIDER_STUDENT_MODULE_ROUTE = 'student';
    public static readonly ENROLLMENT_REQUEST_MODULE_ROUTE =
        'enrollment-request';
    public static readonly PROFILE_MODULE_ROUTE = 'profile';
    public static readonly OPD_MODULE_ROUTE = 'opd';
    public static readonly PATIENTS_MODULE_ROUTE = 'patients';
    public static readonly REPORT_MODULE_ROUTE = 'report';
    public static readonly CLASSES_MODULE_ROUTE = 'sessions';
    public static readonly GO_LIVE_MODULE_ROUTE = 'live';
    public static readonly MATERIAL_MODULE_ROUTE = 'material';
    public static readonly STUDENT_JOIN_CLASS_MODULE_ROUTE = 'join-class';
    public static readonly STUDENT_ENROLL_MODULE_ROUTE = 'enrolment-request';
    public static readonly STUDENT_MATERIAL_MODULE_ROUTE = 'student-material';
    public static readonly STUDENT_PROFILE_MODULE_ROUTE = 'student-profile';
    public static readonly PROFILE_DETAILS_MODULE_ROUTE = 'provider-profile';
    public static readonly LOGIN_MODULE_ROUTE = 'login';
    public static readonly USER_MANAGEMENT_MODULE_ROUTE = 'user-management';
    public static readonly STUDENT_PROFILE_DETAILS_MODULE_ROUTE =
        'profile-student';
    public static readonly STUDENT_ENROLLMENT_STATUS_MODULE_ROUTE =
        'student-enrollment-status';
    public static readonly RECORDED_SESSION_MODULE_ROUTE = 'recorded-session';
    public static readonly ROLE_MANAGEMENT_MODULE_ROUTE = 'role-management';
    public static readonly PRACTICE_MODULE_ROUTE = 'practice';
    public static readonly PARENT_CLASSES_MODULE_ROUTE = 'classes';
    public static readonly STUDENT_DOUBT_MODULE_ROUTE = 'student-doubts';
    public static readonly PROVIDER_DOUBT_MODULE_ROUTE = 'provider-doubts';
    public static readonly ASSIGNMENT_MODULE_ROUTE = 'assignment';
    public static readonly STUDENT_ASSIGNMENT_MODULE_ROUTE =
        'student-assignment';
    public static readonly CLASS_REPORT_MODULE_ROUTE = 'reports';
    public static readonly CLASS_ATTENDANCE_MODULE_ROUTE = 'attendance';
    public static readonly CHAPTER_MANAGEMENT_MODULE_ROUTE =
        'chapter-management';
    public static readonly STUDENT_PRACTICE_MODULE_ROUTE = 'student-practice';
    public static readonly PROVIDER_PRACTICE_MODULE_ROUTE = 'provider-practice';
    public static readonly PROVIDER_QUESTION_BANK_MODULE_ROUTE =
        'question-bank';
    public static readonly STUDENT_PRACTICE_REPORT_MODULE_ROUTE = 'practice';

    public static readonly PROFILE_EDIT_ROUTE = `${RouteConstant.EDIT}`;
    public static readonly PROFILE_EDIT = `${RouteConstant.PROFILE_MODULE_ROUTE}/${RouteConstant.PROFILE_EDIT_ROUTE}`;

    public static readonly OPD_ROUTE = '';
    public static readonly OPD = `${RouteConstant.OPD_MODULE_ROUTE}/${RouteConstant.OPD_ROUTE}`;
    // Common constant

    public static readonly STUDENT_RECORDED_SESSION_MODULE_ROUTE =
        'student-recorded-session';

    public static readonly PATIENTS_ROUTE = '';
    public static readonly PATIENTS = `${RouteConstant.PATIENTS_MODULE_ROUTE}/${RouteConstant.PATIENTS_ROUTE}`;

    public static readonly OPD_REPORT_ROUTE = 'opd';
    public static readonly OPD_REPORT = `${RouteConstant.REPORT_MODULE_ROUTE}/${RouteConstant.OPD_REPORT_ROUTE}`;

    public static readonly CLASS_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly CLASS_LIST = `${RouteConstant.CLASSES_MODULE_ROUTE}/${RouteConstant.CLASS_LIST_ROUTE}`;

    public static readonly CLASS_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly CLASS_VIEW = `${RouteConstant.CLASSES_MODULE_ROUTE}/${RouteConstant.CLASS_VIEW_ROUTE}`;

    public static readonly PARENT_CLASS_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly PARENT_CLASS_LIST = `${RouteConstant.PARENT_CLASSES_MODULE_ROUTE}/${RouteConstant.PARENT_CLASS_LIST_ROUTE}`;

    public static readonly PARENT_CLASS_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly PARENT_CLASS_VIEW = `${RouteConstant.PARENT_CLASSES_MODULE_ROUTE}/${RouteConstant.PARENT_CLASS_VIEW_ROUTE}`;

    public static readonly PROVIDER_STUDENT_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly PROVIDER_STUDENT_LIST = `${RouteConstant.PROVIDER_STUDENT_MODULE_ROUTE}/${RouteConstant.PROVIDER_STUDENT_LIST_ROUTE}`;

    public static readonly PROVIDER_STUDENT_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly PROVIDER_STUDENT_VIEW = `${RouteConstant.PROVIDER_STUDENT_MODULE_ROUTE}/${RouteConstant.PROVIDER_STUDENT_VIEW_ROUTE}`;

    public static readonly STUDENT_MODULE_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly STUDENT_MODULE_VIEW = `${RouteConstant.STUDENT_MODULE_ROUTE}/${RouteConstant.STUDENT_MODULE_VIEW_ROUTE}`;

    public static readonly MATERIAL_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly MATERIAL_LIST = `${RouteConstant.MATERIAL_MODULE_ROUTE}/${RouteConstant.MATERIAL_LIST_ROUTE}`;

    public static readonly MATERIAL_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly MATERIAL_VIEW = `${RouteConstant.MATERIAL_MODULE_ROUTE}/${RouteConstant.MATERIAL_VIEW_ROUTE}`;

    public static readonly STUDENT_MATERIAL_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly STUDENT_MATERIAL_LIST = `${RouteConstant.STUDENT_MATERIAL_MODULE_ROUTE}/${RouteConstant.STUDENT_MATERIAL_LIST_ROUTE}`;

    public static readonly PROFILE_DETAILS_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly PROFILE_DETAILS_VIEW = `${RouteConstant.PROFILE_DETAILS_MODULE_ROUTE}/${RouteConstant.PROFILE_DETAILS_VIEW_ROUTE}`;

    public static readonly PROFILE_DETAILS_EDIT_ROUTE = `${RouteConstant.EDIT}`;
    public static readonly PROFILE_DETAILS_EDIT = `${RouteConstant.PROFILE_DETAILS_MODULE_ROUTE}/${RouteConstant.PROFILE_DETAILS_EDIT_ROUTE}`;

    public static readonly USER_MANAGEMENT_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly USER_MANAGEMENT_LIST = `${RouteConstant.USER_MANAGEMENT_MODULE_ROUTE}/${RouteConstant.USER_MANAGEMENT_LIST_ROUTE}`;

    public static readonly USER_MANAGEMENT_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly USER_MANAGEMENT_VIEW = `${RouteConstant.USER_MANAGEMENT_MODULE_ROUTE}/${RouteConstant.USER_MANAGEMENT_VIEW_ROUTE}`;
    public static readonly STUDENT_ENROLLMENT_STATUS_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly STUDENT_ENROLLMENT_STATUS_LIST = `${RouteConstant.STUDENT_ENROLLMENT_STATUS_MODULE_ROUTE}/${RouteConstant.STUDENT_ENROLLMENT_STATUS_LIST_ROUTE}`;

    public static readonly ROLE_MANAGEMENT_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly ROLE_MANAGEMENT_LIST = `${RouteConstant.ROLE_MANAGEMENT_MODULE_ROUTE}/${RouteConstant.ROLE_MANAGEMENT_LIST_ROUTE}`;

    public static readonly ROLE_MANAGEMENT_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly ROLE_MANAGEMENT_VIEW = `${RouteConstant.ROLE_MANAGEMENT_MODULE_ROUTE}/${RouteConstant.ROLE_MANAGEMENT_VIEW_ROUTE}`;

    public static readonly RECORDED_SESSION_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly RECORDED_SESSION_LIST = `${RouteConstant.RECORDED_SESSION_MODULE_ROUTE}/${RouteConstant.RECORDED_SESSION_LIST_ROUTE}`;

    public static readonly RECORDED_SESSION_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly RECORDED_SESSION_VIEW = `${RouteConstant.RECORDED_SESSION_MODULE_ROUTE}/${RouteConstant.RECORDED_SESSION_VIEW_ROUTE}`;

    public static readonly GRADE_SELECTION_ROUTE = 'grade';
    public static readonly GRADE_SELECTION = `${RouteConstant.MATERIAL_MODULE_ROUTE}/${RouteConstant.GRADE_SELECTION_ROUTE}`;

    public static readonly SUBJECT_SELECTION_ROUTE = 'subject';
    public static readonly SUBJECT_SELECTION = `${RouteConstant.MATERIAL_MODULE_ROUTE}/${RouteConstant.SUBJECT_SELECTION_ROUTE}`;

    public static readonly MATERIAL_SELECTION_ROUTE = 'material';
    public static readonly MATERIAL_SELECTION = `${RouteConstant.MATERIAL_MODULE_ROUTE}/${RouteConstant.MATERIAL_SELECTION_ROUTE}`;
    public static readonly STUDENT_SUBJECT_SELECTION_ROUTE = 'subject';
    public static readonly STUDENT_SUBJECT_SELECTION = `${RouteConstant.STUDENT_MATERIAL_MODULE_ROUTE}/${RouteConstant.STUDENT_SUBJECT_SELECTION_ROUTE}`;

    public static readonly PRACTICE_ROUTE = '';
    public static readonly PRACTICE = `${RouteConstant.PRACTICE_MODULE_ROUTE}/${RouteConstant.PRACTICE_ROUTE}`;
    public static readonly CHOOSE_GRADE_PRACTICE_ROUTE = 'choose-grade';
    public static readonly CHOOSE_GRADE_PRACTICE = `${RouteConstant.PROVIDER_PRACTICE_MODULE_ROUTE}/${RouteConstant.CHOOSE_GRADE_PRACTICE_ROUTE}`;
    public static readonly QUESTION_SELECT_PRACTICE_ROUTE = 'select-question';
    public static readonly QUESTION_SELECT_PRACTICE = `${RouteConstant.PROVIDER_PRACTICE_MODULE_ROUTE}/${RouteConstant.QUESTION_SELECT_PRACTICE_ROUTE}`;
    public static readonly CHOOSE_SUBJECT_PRACTICE_ROUTE = 'choose-subject';
    public static readonly CHOOSE_SUBJECT_PRACTICE = `${RouteConstant.PROVIDER_PRACTICE_MODULE_ROUTE}/${RouteConstant.CHOOSE_SUBJECT_PRACTICE_ROUTE}`;
    public static readonly PRACTICE_LIST_ROUTE = 'practice-list';
    public static readonly PRACTICE_LIST = `${RouteConstant.PROVIDER_PRACTICE_MODULE_ROUTE}/${RouteConstant.PRACTICE_LIST_ROUTE}`;
    public static readonly CHOOSE_SUBJECT_STUDENT_PRACTICE_ROUTE =
        'choose-subject';
    public static readonly CHOOSE_SUBJECT_STUDENT_PRACTICE = `${RouteConstant.STUDENT_PRACTICE_MODULE_ROUTE}/${RouteConstant.CHOOSE_SUBJECT_STUDENT_PRACTICE_ROUTE}`;
    public static readonly PRACTICE_LIST_STUDENT_ROUTE = 'practice-list';
    public static readonly PRACTICE_LIST_STUDENT = `${RouteConstant.STUDENT_PRACTICE_MODULE_ROUTE}/${RouteConstant.PRACTICE_LIST_STUDENT_ROUTE}`;
    public static readonly PRACTICE_QUESTION_STUDENT_ROUTE = 'question';
    public static readonly PRACTICE_QUESTION_STUDENT = `${RouteConstant.STUDENT_PRACTICE_MODULE_ROUTE}/${RouteConstant.PRACTICE_QUESTION_STUDENT_ROUTE}`;
    public static readonly STUDENT_BOOKMARK_QUESTION_ROUTE =
        'bookmark-question';
    public static readonly STUDENT_BOOKMARK_QUESTION = `${RouteConstant.STUDENT_PRACTICE_MODULE_ROUTE}/${RouteConstant.STUDENT_BOOKMARK_QUESTION_ROUTE}`;
    public static readonly PRACTICE_CHAPTER_STUDENT_ROUTE = 'chapter';
    public static readonly PRACTICE_CHAPTER_STUDENT = `${RouteConstant.STUDENT_PRACTICE_MODULE_ROUTE}/${RouteConstant.PRACTICE_CHAPTER_STUDENT_ROUTE}`;

    public static readonly QUE_BANK_GRADE_ROUTE = 'grade';
    public static readonly QUE_BANK_GRADE = `${RouteConstant.PROVIDER_QUESTION_BANK_MODULE_ROUTE}/${RouteConstant.QUE_BANK_GRADE_ROUTE}`;
    public static readonly QUE_BANK_SUBJECT_ROUTE = 'grade/subject';
    public static readonly QUE_BANK_SUBJECT = `${RouteConstant.PROVIDER_QUESTION_BANK_MODULE_ROUTE}/${RouteConstant.QUE_BANK_SUBJECT_ROUTE}`;
    public static readonly QUE_BANK_CHAPTER_LIST_ROUTE =
        'grade/subject/chapter-list';
    public static readonly QUE_BANK_CHAPTER_LIST = `${RouteConstant.PROVIDER_QUESTION_BANK_MODULE_ROUTE}/${RouteConstant.QUE_BANK_CHAPTER_LIST_ROUTE}`;
    public static readonly QUE_BANK_QUE_LIST_ROUTE =
        'grade/subject/add-question';
    public static readonly QUE_BANK_QUE_LIST = `${RouteConstant.PROVIDER_QUESTION_BANK_MODULE_ROUTE}/${RouteConstant.QUE_BANK_QUE_LIST_ROUTE}`;

    public static readonly STUDENT_RECORDED_SESSION_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly STUDENT_RECORDED_SESSION_LIST = `${RouteConstant.STUDENT_RECORDED_SESSION_MODULE_ROUTE}/${RouteConstant.STUDENT_RECORDED_SESSION_LIST_ROUTE}`;

    public static readonly STUDENT_RECORDED_SESSION_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly STUDENT_RECORDED_SESSION_VIEW = `${RouteConstant.STUDENT_RECORDED_SESSION_MODULE_ROUTE}/${RouteConstant.STUDENT_RECORDED_SESSION_VIEW_ROUTE}`;

    public static readonly CHAPTER_MANAGEMENT_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly CHAPTER_MANAGEMENT_LIST = `${RouteConstant.CHAPTER_MANAGEMENT_MODULE_ROUTE}/${RouteConstant.CHAPTER_MANAGEMENT_LIST_ROUTE}`;

    public static readonly CHAPTER_MANAGEMENT_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly CHAPTER_MANAGEMENT_VIEW = `${RouteConstant.CHAPTER_MANAGEMENT_MODULE_ROUTE}/${RouteConstant.CHAPTER_MANAGEMENT_VIEW_ROUTE}`;

    // Auth routes
    public static readonly SIGN_UP = 'sign-up';
    public static readonly PROFILE = 'profile';
    public static readonly FORGOT_PASSWORD = 'forgot-password';
    public static readonly RESET_PASSWORD = 'reset-password';
    public static readonly BUILD_PROFILE = `${RouteConstant.PROFILE}/build`;
    public static readonly PERSONAL_INFO = `${RouteConstant.PROFILE}/info`;
    public static readonly STUDENT_PROFILE_DETAILS_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly STUDENT_PROFILE_DETAILS_VIEW = `${RouteConstant.STUDENT_PROFILE_DETAILS_MODULE_ROUTE}/${RouteConstant.STUDENT_PROFILE_DETAILS_VIEW_ROUTE}`;

    public static readonly STUDENT_PROFILE_DETAILS_EDIT_ROUTE = `${RouteConstant.EDIT}`;
    public static readonly STUDENT_PROFILE_DETAILS_EDIT = `${RouteConstant.STUDENT_PROFILE_DETAILS_MODULE_ROUTE}/${RouteConstant.STUDENT_PROFILE_DETAILS_EDIT_ROUTE}`;

    public static readonly STUDENT_DOUBT_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly STUDENT_DOUBT_LIST = `${RouteConstant.STUDENT_DOUBT_MODULE_ROUTE}/${RouteConstant.STUDENT_DOUBT_LIST_ROUTE}`;

    public static readonly STUDENT_ALL_DOUBTS_ROUTE = 'all-doubts';
    public static readonly STUDENT_ALL_DOUBTS = `${RouteConstant.STUDENT_DOUBT_MODULE_ROUTE}/${RouteConstant.STUDENT_ALL_DOUBTS_ROUTE}`;

    public static readonly STUDENT_ALL_BOOKMARK_DOUBTS_ROUTE = 'all-bookmarks';
    // tslint:disable-next-line: max-line-length
    public static readonly STUDENT_ALL_BOOKMARK_DOUBTS = `${RouteConstant.STUDENT_DOUBT_MODULE_ROUTE}/${RouteConstant.STUDENT_ALL_BOOKMARK_DOUBTS_ROUTE}`;

    public static readonly ASK_DOUBT_SELECT_SUBJECT_ROUTE = 'select-subject';
    public static readonly ASK_DOUBT_SELECT_SUBJECT = `${RouteConstant.STUDENT_DOUBT_MODULE_ROUTE}/${RouteConstant.ASK_DOUBT_SELECT_SUBJECT_ROUTE}`;

    public static readonly STUDENT_QUESTION_ANSWER_ROUTE = 'question-answer';
    public static readonly STUDENT_QUESTION_ANSWER = `${RouteConstant.STUDENT_DOUBT_MODULE_ROUTE}/${RouteConstant.STUDENT_QUESTION_ANSWER_ROUTE}`;

    public static readonly PROVIDER_RECIEVED_DOUBTS_ROUTE = `recieved-doubts`;
    public static readonly PROVIDER_RECIEVED_DOUBTS = `${RouteConstant.PROVIDER_DOUBT_MODULE_ROUTE}/${RouteConstant.PROVIDER_RECIEVED_DOUBTS_ROUTE}`;

    public static readonly PROVIDER_ALL_DOUBTS_ROUTE = 'all-doubts';
    public static readonly PROVIDER_ALL_DOUBTS = `${RouteConstant.PROVIDER_DOUBT_MODULE_ROUTE}/${RouteConstant.PROVIDER_ALL_DOUBTS_ROUTE}`;

    public static readonly PROVIDER_QUESTION_ANSWER_ROUTE = 'question-answer';
    public static readonly PROVIDER_QUESTION_ANSWER = `${RouteConstant.PROVIDER_DOUBT_MODULE_ROUTE}/${RouteConstant.PROVIDER_QUESTION_ANSWER_ROUTE}`;

    public static readonly ASSIGNMENT_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly ASSIGNMENT_LIST = `${RouteConstant.ASSIGNMENT_MODULE_ROUTE}/${RouteConstant.ASSIGNMENT_LIST_ROUTE}`;

    public static readonly ASSIGNMENT_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly ASSIGNMENT_VIEW = `${RouteConstant.ASSIGNMENT_MODULE_ROUTE}/${RouteConstant.ASSIGNMENT_VIEW_ROUTE}`;

    public static readonly ASSIGNMENT_SUBMISSION_VIEW_ROUTE = 'view/submission';
    public static readonly ASSIGNMENT_SUBMISSION_VIEW = `${RouteConstant.ASSIGNMENT_MODULE_ROUTE}/${RouteConstant.ASSIGNMENT_SUBMISSION_VIEW_ROUTE}`;

    public static readonly STUDENT_ASSIGNMENT_LIST_ROUTE = `${RouteConstant.LIST}`;
    public static readonly STUDENT_ASSIGNMENT_LIST = `${RouteConstant.STUDENT_ASSIGNMENT_MODULE_ROUTE}/${RouteConstant.STUDENT_ASSIGNMENT_LIST_ROUTE}`;

    public static readonly STUDENT_ASSIGNMENT_VIEW_ROUTE = `${RouteConstant.VIEW}`;
    public static readonly STUDENT_ASSIGNMENT_VIEW = `${RouteConstant.STUDENT_ASSIGNMENT_MODULE_ROUTE}/${RouteConstant.STUDENT_ASSIGNMENT_VIEW_ROUTE}`;

    public static readonly STUDENT_ASSIGNMENT_COMPLETED_ROUTE = 'view/complete';
    public static readonly STUDENT_ASSIGNMENT_COMPLETED = `${RouteConstant.STUDENT_ASSIGNMENT_MODULE_ROUTE}/${RouteConstant.STUDENT_ASSIGNMENT_COMPLETED_ROUTE}`;

    // Auth routes
    public static readonly LOGIN_ROUTE = '';
    public static readonly LOGIN = `${RouteConstant.LOGIN_MODULE_ROUTE}`;

    // Student Auth routes
    public static readonly STUDENT_SIGN_UP = 'student-sign-up';
    public static readonly STUDENT_PROFILE = 'student-profile';
    public static readonly STUDENT_FORGOT_PASSWORD = 'student-forgot-password';
    public static readonly STUDENT_RESET_PASSWORD = 'student-reset-password';
    public static readonly STUDENT_BUILD_PROFILE = `${RouteConstant.STUDENT_PROFILE}/build`;
    // public static readonly STUDENT_PARENT_INFO = `${RouteConstant.STUDENT_PROFILE}/info`;

    public static readonly MOBILE_STREAMING = `mobile`;
    public static readonly MOBILE_STREAMING_ROUTE = `${RouteConstant.MOBILE_STREAMING}/streaming`;

    public static readonly CLASS_ATTENDANCE_LIST_ROUTE = '';
    public static readonly CLASS_ATTENDANCE_LIST = `${RouteConstant.CLASS_REPORT_MODULE_ROUTE}/${RouteConstant.CLASS_ATTENDANCE_MODULE_ROUTE}/${RouteConstant.CLASS_ATTENDANCE_LIST_ROUTE}`;

    public static readonly CLASS_ATTENDANCE_VIEW_ROUTE = 'view';
    public static readonly CLASS_ATTENDANCE_VIEW = `${RouteConstant.CLASS_REPORT_MODULE_ROUTE}/${RouteConstant.CLASS_ATTENDANCE_MODULE_ROUTE}/${RouteConstant.CLASS_ATTENDANCE_VIEW_ROUTE}`;

    public static readonly STUDENT_PRACTICE_REPORT_LIST_ROUTE = '';
    public static readonly STUDENT_PRACTICE_REPORT_LIST = `${RouteConstant.CLASS_REPORT_MODULE_ROUTE}/${RouteConstant.STUDENT_PRACTICE_REPORT_MODULE_ROUTE}/${RouteConstant.STUDENT_PRACTICE_REPORT_LIST_ROUTE}`;
    // home page routes

    public static readonly HOME = '';
    public static readonly STUDENTS = 'students';
    public static readonly PROVIDERS = 'providers';
    public static readonly ABOUT_US = 'about-us';
    public static readonly PRIVACY_POLICY = 'privacy-policy';
    public static readonly CONTACT_US = 'contact-us';
    // public static readonly TEAM = 'team';

    // Provider course routes
    public static readonly COURSE_PROVIDER_MODULE_ROUTE = 'course';

    public static readonly COURSE_LIST_ROUTE = '';
    public static readonly COURSE_LIST = `${RouteConstant.COURSE_PROVIDER_MODULE_ROUTE}/${RouteConstant.COURSE_LIST_ROUTE}`;

    public static readonly CREATE_COURSE_ROUTE = 'create';
    public static readonly CREATE_COURSE = `${RouteConstant.COURSE_PROVIDER_MODULE_ROUTE}/${RouteConstant.CREATE_COURSE_ROUTE}`;

    public static readonly CREATE_COURSE_TITLE_ROUTE = 'title';
    public static readonly CREATE_COURSE_TITLE = `${RouteConstant.COURSE_PROVIDER_MODULE_ROUTE}/${RouteConstant.CREATE_COURSE_TITLE_ROUTE}`;

    public static readonly EDIT_COURSE_ROUTE = 'edit';
    public static readonly EDIT_COURSE = `${RouteConstant.COURSE_PROVIDER_MODULE_ROUTE}/${RouteConstant.EDIT_COURSE_ROUTE}`;

    public static readonly ENROLLMENT_STUDENT_ROUTE = 'enrollment-student';
    public static readonly ENROLLMENT_STUDENT = `${RouteConstant.COURSE_PROVIDER_MODULE_ROUTE}/${RouteConstant.ENROLLMENT_STUDENT_ROUTE}`;

    // student course routes
    public static readonly STUDENT_COURSE_MODULE_ROUTE = 'student-course';

    public static readonly STUDENT_COURSE_CONTAINER_ROUTE = `${RouteConstant.LIST}`;
    public static readonly STUDENT_COURSE_CONTAINER = `${RouteConstant.STUDENT_COURSE_MODULE_ROUTE}/${RouteConstant.STUDENT_COURSE_CONTAINER_ROUTE}`;

    public static readonly STUDENT_COURSE_DETAILS_CONTAINER_ROUTE = `${RouteConstant.LIST}/details`;
    public static readonly STUDENT_COURSE_DETAILS_CONTAINER = `${RouteConstant.STUDENT_COURSE_MODULE_ROUTE}/${RouteConstant.STUDENT_COURSE_DETAILS_CONTAINER_ROUTE}`;

    public static readonly ENROLL_COURSE_CONTAINER_ROUTE = `${RouteConstant.LIST}/enroll-course`;
    public static readonly ENROLL_COURSE_CONTAINER = `${RouteConstant.STUDENT_COURSE_MODULE_ROUTE}/${RouteConstant.ENROLL_COURSE_CONTAINER_ROUTE}`;

}

export const PUBLIC_ROUTES = [
    '/' + RouteConstant.HOME,
    '/' + RouteConstant.PROVIDERS,
    '/' + RouteConstant.STUDENTS,
    '/' + RouteConstant.LOGIN,
    '/' + RouteConstant.SIGN_UP,
    '/' + RouteConstant.FORGOT_PASSWORD,
    '/' + RouteConstant.RESET_PASSWORD,
    '/' + RouteConstant.STUDENT_SIGN_UP,
    '/' + RouteConstant.STUDENT_FORGOT_PASSWORD,
    '/' + RouteConstant.STUDENT_RESET_PASSWORD,
    '/' + RouteConstant.MOBILE_STREAMING_ROUTE,
    '/' + RouteConstant.ABOUT_US,
    '/' + RouteConstant.PRIVACY_POLICY,
    '/' + RouteConstant.CONTACT_US
    // '/' + RouteConstant.TEAM
];

export const PROVIDER_ROUTES = [
    '/' + RouteConstant.PROVIDER_DASHBOARD_MODULE_ROUTE,
    '/' + RouteConstant.PROVIDER_STUDENT_MODULE_ROUTE,
    '/' + RouteConstant.CLASSES_MODULE_ROUTE,
    '/' + RouteConstant.ENROLLMENT_REQUEST_MODULE_ROUTE,
    '/' + RouteConstant.GO_LIVE_MODULE_ROUTE,
    '/' + RouteConstant.MATERIAL_MODULE_ROUTE,
    '/' + RouteConstant.PROFILE_DETAILS_MODULE_ROUTE,
    '/' + RouteConstant.ROLE_MANAGEMENT_MODULE_ROUTE,
    '/' + RouteConstant.RECORDED_SESSION_MODULE_ROUTE,
    '/' + RouteConstant.USER_MANAGEMENT_MODULE_ROUTE,
    '/' + RouteConstant.PROFILE_DETAILS_EDIT,
    '/' + RouteConstant.PROVIDER_DOUBT_MODULE_ROUTE,
    '/' + RouteConstant.MATERIAL_SELECTION,
    '/' + RouteConstant.PARENT_CLASSES_MODULE_ROUTE,
    '/' + RouteConstant.CHAPTER_MANAGEMENT_MODULE_ROUTE,
    '/' + RouteConstant.PROVIDER_QUESTION_BANK_MODULE_ROUTE,
    '/' + RouteConstant.QUE_BANK_QUE_LIST
];

export const STUDENT_ROUTES = [
    '/' + RouteConstant.STUDENT_DASHBOARD_MODULE_ROUTE,
    '/' + RouteConstant.STUDENT_JOIN_CLASS_MODULE_ROUTE,
    '/' + RouteConstant.STUDENT_MATERIAL_MODULE_ROUTE,
    '/' + RouteConstant.STUDENT_PROFILE_DETAILS_MODULE_ROUTE,
    '/' + RouteConstant.STUDENT_ENROLLMENT_STATUS_MODULE_ROUTE,
    '/' + RouteConstant.STUDENT_MATERIAL_LIST,
    // '/' + RouteConstant.STUDENT_BUILD_PROFILE,
    '/' + RouteConstant.STUDENT_DOUBT_MODULE_ROUTE,
    '/' + RouteConstant.STUDENT_RECORDED_SESSION_LIST,
    '/' + RouteConstant.STUDENT_RECORDED_SESSION_VIEW,
    '/' + RouteConstant.ASK_DOUBT_SELECT_SUBJECT,
    '/' + RouteConstant.STUDENT_PROFILE_DETAILS_EDIT
];

export const APPROVE_USER_ROUTES = [
    '/' + RouteConstant.ENROLLMENT_REQUEST_MODULE_ROUTE,
    '/' + RouteConstant.PROFILE_DETAILS_EDIT
];
