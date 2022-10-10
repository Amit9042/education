import { environment } from '../../../environments/environment';

export enum USER_TYPE {
    PROVIDER = '/provider',
    STUDENT = '/student'
}

const BASE_URL = environment.apiUrl;
const PUBLIC = '/public';
const VERSION = '/api/v1';
const VERSION_2 = '/api/v2';
const VERSION_3 = '/api/v3';
const DOUBT = '/doubts';
const COURSE_VERSION = '/api/course/v1';

const PROVIDER_PUBLIC_API_BASE_URL =
    BASE_URL + USER_TYPE.PROVIDER + PUBLIC + VERSION;
const PROVIDER_PRIVATE_API_BASE_URL = BASE_URL + USER_TYPE.PROVIDER + VERSION;
const PROVIDER_PRIVATE_API_BASE_URL_V2 =
    BASE_URL + USER_TYPE.PROVIDER + VERSION_2;

const STUDENT_PUBLIC_API_BASE_URL =
    BASE_URL + USER_TYPE.STUDENT + PUBLIC + VERSION;
const STUDENT_PRIVATE_API_BASE_URL = BASE_URL + USER_TYPE.STUDENT + VERSION;
const STUDENT_PRIVATE_API_BASE_URL_V2 =
    BASE_URL + USER_TYPE.STUDENT + VERSION_2;
const STUDENT_PRIVATE_API_BASE_URL_V3 =
    BASE_URL + USER_TYPE.STUDENT + VERSION_3;
const DOUBT_API_BASE_URL = BASE_URL + DOUBT + VERSION;
const DOUBT_API_BASE_URL_V2 = BASE_URL + DOUBT + VERSION_2;

export class ApplicationApi {
    // Authentication Module Api's
    public static readonly LOGIN = `${PROVIDER_PUBLIC_API_BASE_URL}/login`;
    public static readonly SIGN_UP = `${PROVIDER_PUBLIC_API_BASE_URL}/signUp`;
    public static readonly LOGOUT = `${BASE_URL}/logout`;
    public static readonly FORGOT_EMAIL = `${BASE_URL}/public/forgot/password`;
    public static readonly RESEND_OTP = `${PROVIDER_PUBLIC_API_BASE_URL}/resendOtp`;
    public static readonly VERIFY_OTP = `${PROVIDER_PUBLIC_API_BASE_URL}/verifyOtp`;
    public static readonly RESET_PASSWORD = `${BASE_URL}/public/reset/forgot/password`;
    public static readonly STUDENT_SIGN_UP = `${STUDENT_PUBLIC_API_BASE_URL}/signUp`;
    public static readonly STUDENT_RESEND_OTP = `${STUDENT_PUBLIC_API_BASE_URL}/resendOtp`;
    public static readonly STUDENT_VERIFY_OTP = `${STUDENT_PUBLIC_API_BASE_URL}/verifyOtp`;
    public static readonly STUDENT_LOGIN = `${STUDENT_PUBLIC_API_BASE_URL}/login`;

    // config api
    public static readonly PROVIDER_CONFIG = `${PROVIDER_PRIVATE_API_BASE_URL}/auth/config`;
    public static readonly STUDENT_CONFIG = `${STUDENT_PRIVATE_API_BASE_URL}/auth/config`;

    // Profile Module Api's
    public static readonly USER_PROFILE = `${PROVIDER_PRIVATE_API_BASE_URL}/provider`;
    public static readonly CREATE_USER_PROFILE = `${PROVIDER_PRIVATE_API_BASE_URL}/provider/buildProfile`;
    public static readonly CREATE_STUDENT_PROFILE = `${STUDENT_PRIVATE_API_BASE_URL}/student/buildProfile`;
    public static readonly CHANGE_MOBILENO_RESEND_OTP = `${STUDENT_PRIVATE_API_BASE_URL}/student/resendContactOtp`;

    // country Api
    public static readonly COUNTRY_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/location/country/list`;
    public static readonly STUDENT_COUNTRY_LIST = `${STUDENT_PUBLIC_API_BASE_URL}/country`;
    public static readonly STUDENT_COUNTRY = `${STUDENT_PUBLIC_API_BASE_URL}/getCountry`;

    // state Api
    public static readonly STATE_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/location/state/list`;

    // city Api
    public static readonly CITY_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/location/city/list`;

    // Student Enroll API
    public static readonly ENROLL_STUDENT = `${STUDENT_PRIVATE_API_BASE_URL}/student/enroll`;
    public static readonly STUDENT_ENROLMENT_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/student/enroll/list`;
    public static readonly STUDENT_CLASS_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/classes/list`;
    public static readonly STUDENT_JOIN_CLASS = `${STUDENT_PRIVATE_API_BASE_URL}/classes/joinClass`;
    public static readonly STUDENT_LEAVE_CLASS = `${STUDENT_PRIVATE_API_BASE_URL}/classes/leaveClass`;
    public static readonly STUDENT_CLASS_DETAILS = `${STUDENT_PRIVATE_API_BASE_URL}/classes/details`;

    // Provider Enroll API
    public static readonly ENROLL_STUDENT_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/enrollment/request/list`;
    public static readonly ACCEPT_ENROLL_REQ = `${PROVIDER_PRIVATE_API_BASE_URL}/enrollment/request/accept`;
    public static readonly REJECT_ENROLL_REQ = `${PROVIDER_PRIVATE_API_BASE_URL}/enrollment/request/reject`;
    public static readonly ASSIGN_CLASS = `${PROVIDER_PRIVATE_API_BASE_URL}/enrollment/assign/class`;
    public static readonly ENROLL_GRADE_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/enrollment/grade/list`;
    public static readonly ENROLL_CLASS_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/enrollment/class/list`;

    // Provider class API
    public static readonly TIMEZONE_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/timezone/list`;
    public static readonly GRADE_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/grade/list`;
    public static readonly MEDIUM_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/medium/list`;
    public static readonly CLASS_ADD = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/add`;
    public static readonly CLASS_EDIT = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/update`;
    public static readonly CLASS_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/list`;
    public static readonly CLASS_UPDATE = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/update`;
    public static readonly CLASS_DETAILS = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/details`;
    public static readonly GOLIVE_CLASS_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/goLiveList`;
    public static readonly PROVIDER_JOIN_CLASS = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/joinClass`;
    public static readonly PROVIDER_CLASS_JOINED = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/joined`;
    public static readonly PROVIDER_LEAVE_CLASS = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/leaveClass`;
    public static readonly STUDENT_LIST_TO_ADD_IN_CLASS = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/student/list`;
    public static readonly ADD_STUDENT_IN_CLASS = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/add/student`;
    public static readonly CLASS_STUDENT_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/details/student/list`;
    public static readonly REMOVE_STUDENT_FROM_CLASS = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/remove/student`;
    public static readonly CLASS_CLONE = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/clone`;

    public static readonly CLASS_ADD_V2 = `${PROVIDER_PRIVATE_API_BASE_URL_V2}/classes/add`;
    public static readonly CLASS_EDIT_V2 = `${PROVIDER_PRIVATE_API_BASE_URL_V2}/classes/update`;
    public static readonly CLASS_LIST_V2 = `${PROVIDER_PRIVATE_API_BASE_URL_V2}/classes/list`;
    public static readonly CLASS_DETAILS_V2 = `${PROVIDER_PRIVATE_API_BASE_URL_V2}/classes/details`;

    // material API
    public static readonly MATERIAL_ADD = `${PROVIDER_PRIVATE_API_BASE_URL}/material/add`;
    public static readonly MATERIAL_EDIT = `${PROVIDER_PRIVATE_API_BASE_URL}/material/edit`;
    public static readonly MATERIAL_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/material/list`;
    public static readonly MATERIAL_DETAILS = `${PROVIDER_PRIVATE_API_BASE_URL}/material/detail`;
    public static readonly MATERIAL_DOWNLOAD = `${PROVIDER_PRIVATE_API_BASE_URL}/material/download`;
    public static readonly MATERIAL_UPDATE_STATUS = `${PROVIDER_PRIVATE_API_BASE_URL}/material/updateStatus`;
    public static readonly MATERIAL_GRADE_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/provider/grade/list`;
    public static readonly MATERIAL_SUB_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/provider/subject/list`;
    public static readonly MATERIAL_DOWNLOAD_V2 = `${PROVIDER_PRIVATE_API_BASE_URL_V2}/material/download`;

    // // material student API
    public static readonly MATERIAL_STUD_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/material/list`;
    public static readonly MATERIAL_STUD_DETAILS = `${STUDENT_PRIVATE_API_BASE_URL}/material/detail`;
    public static readonly MATERIAL_STUD_DOWNLOAD = `${STUDENT_PRIVATE_API_BASE_URL}/material/download`;
    public static readonly MATERIAL_STUD_SUB_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/material/subject/list`;
    public static readonly MATERIAL_STUD_DOWNLOAD_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/material/download`;
    public static readonly MATERIAL_STUD_LIST_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/material/list`;

    // student provider API
    public static readonly STUD_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/student/list`;
    public static readonly STUD_DETAILS = `${PROVIDER_PRIVATE_API_BASE_URL}/student/details`;
    public static readonly STUD_REMOVE = `${PROVIDER_PRIVATE_API_BASE_URL}/student/remove`;

    public static readonly PROVIDER_TYPE_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/provider/type/list`;
    public static readonly BOARD_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/board/list`;
    public static readonly SUBJECT_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/subject/list`;

    // student profile
    public static readonly GET_STUDENT_PROFILE = `${STUDENT_PRIVATE_API_BASE_URL}/student`;
    public static readonly EDIT_STUDENT_PROFILE = `${STUDENT_PRIVATE_API_BASE_URL}/student/editProfile`;
    public static readonly STUDENT_CHANGE_MOBILE = `${STUDENT_PRIVATE_API_BASE_URL}/student/editContact`;
    public static readonly STUDENT_CHANGE_CONTACT_OTP_VERIFY = `${STUDENT_PRIVATE_API_BASE_URL}/student/verifyContactOtp`;
    public static readonly CHANGE_STUDENT_PASSWORD = `${STUDENT_PRIVATE_API_BASE_URL}/auth/changePassword`;

    // provider profile
    public static readonly GET_PROVIDER_DETAIL = `${PROVIDER_PRIVATE_API_BASE_URL}/provider`;
    public static readonly UPDADTE_PROVIDER_PROFILE = `${PROVIDER_PRIVATE_API_BASE_URL}/provider/editProfile`;
    public static readonly CHANGE_PASSWORD = `${PROVIDER_PRIVATE_API_BASE_URL}/auth/changePassword`;
    public static readonly UPDADTE_PROVIDER_USER_PROFILE = `${PROVIDER_PRIVATE_API_BASE_URL}/provider/user/editProfile`;

    // forgotPassword
    public static readonly FORGOT_PASSWORD = `${PROVIDER_PUBLIC_API_BASE_URL}/forgotPassword`;
    public static readonly VERIFY_FORGOTPASSWORD_OTP = `${PROVIDER_PUBLIC_API_BASE_URL}/verifyForgotPasswordOtp`;
    public static readonly RESET_PROVIDER_PASSWORD = `${PROVIDER_PUBLIC_API_BASE_URL}/resetPassword`;
    public static readonly RESEND_PROVIDER_FORGOT_PASSWORD_OTP = `${PROVIDER_PUBLIC_API_BASE_URL}/resendForgotPasswordOtp`;

    // forgotStudentPassword
    public static readonly STUDENT_FORGOT_PASSWORD = `${STUDENT_PUBLIC_API_BASE_URL}/forgotPassword`;
    public static readonly STUDENT_VERIFY_FORGOTPASSWORD_OTP = `${STUDENT_PUBLIC_API_BASE_URL}/verifyForgotPasswordOtp`;
    public static readonly RESET_STUDENT_PASSWORD = `${STUDENT_PUBLIC_API_BASE_URL}/resetPassword`;
    public static readonly RESEND_FORGOT_PASSWORD_OTP = `${STUDENT_PUBLIC_API_BASE_URL}/resendForgotPasswordOtp`;

    //provider user managment
    public static readonly USER_INVITE = `${PROVIDER_PRIVATE_API_BASE_URL}/userManagement/invite`;
    public static readonly USER_EDIT = `${PROVIDER_PRIVATE_API_BASE_URL}/userManagement/update`;
    public static readonly USER_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/userManagement/list`;
    public static readonly USER_DETAILS = `${PROVIDER_PRIVATE_API_BASE_URL}/userManagement/details`;
    public static readonly USER_UPDATE_STATUS = `${PROVIDER_PRIVATE_API_BASE_URL}/userManagement/updateStatus`;
    public static readonly ROLE_LIST = `${BASE_URL}/identity/protected/role/filter`;
    public static readonly USER_INVITE_RESEND = `${PROVIDER_PRIVATE_API_BASE_URL}/userManagement/invite/resend`;
    public static readonly USER_EDIT_V2 = `${PROVIDER_PRIVATE_API_BASE_URL_V2}/userManagement/update`;

    // Student Notification apis
    public static readonly STUDENT_NOTIFICATION_BADGE = `${STUDENT_PRIVATE_API_BASE_URL_V2}/notification/badgeCount`;
    public static readonly STUDENT_NOTIFICATION_LIST = `${STUDENT_PRIVATE_API_BASE_URL_V2}/notification/list`;
    public static readonly STUDENT_NOTIFICATION_READ_ALL = `${STUDENT_PRIVATE_API_BASE_URL_V2}/notification/readAll`;
    public static readonly STUDENT_NOTIFICATION_VIEW = `${STUDENT_PRIVATE_API_BASE_URL_V2}/notification/viewOrRead`;

    // Provider Notification apis
    public static readonly PROVIDER_NOTIFICATION_BADGE = `${PROVIDER_PRIVATE_API_BASE_URL}/notification/badgeCount`;
    public static readonly PROVIDER_NOTIFICATION_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/notification/list`;
    public static readonly PROVIDER_NOTIFICATION_READ_ALL = `${PROVIDER_PRIVATE_API_BASE_URL}/notification/readAll`;
    public static readonly PROVIDER_NOTIFICATION_VIEW = `${PROVIDER_PRIVATE_API_BASE_URL}/notification/viewOrRead`;

    // Contact us api
    public static readonly USER_CONTACT_US = `${STUDENT_PUBLIC_API_BASE_URL}/contactUs`;

    // Provider Recording API
    public static readonly PROVIDER_RECORDING_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/recording/list`;
    public static readonly PROVIDER_RECORDING_STATUS_UPDATE = `${PROVIDER_PRIVATE_API_BASE_URL}/recording/toggleRecording`;
    public static readonly PROVIDER_RECORDING_DETAILS = `${PROVIDER_PRIVATE_API_BASE_URL}/recording`;

    public static readonly ASSIGN_PARENT_CLASS = `${PROVIDER_PRIVATE_API_BASE_URL}/enrollment/assign/parent/class`;

    public static readonly PARENT_CLASS_ADD = `${PROVIDER_PRIVATE_API_BASE_URL}/parent/class/add`;
    public static readonly PARENT_CLASS_EDIT = `${PROVIDER_PRIVATE_API_BASE_URL}/parent/class/edit`;
    public static readonly PARENT_CLASS_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/parent/class/list`;
    public static readonly PARENT_CLASS_ENABLE = `${PROVIDER_PRIVATE_API_BASE_URL}/parent/class/updateStatus`;
    public static readonly PARENT_CLASS_DETAILS = `${PROVIDER_PRIVATE_API_BASE_URL}/parent/class/details`;
    public static readonly PARENT_CLASS_REMOVE_STUDENT = `${PROVIDER_PRIVATE_API_BASE_URL}/parent/class/remove/student`;
    public static readonly PARENT_CLASS_STUDENT_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/parent/class/details/student/list`;
    public static readonly PARENT_CLASS_ADD_STUDENT_IN = `${PROVIDER_PRIVATE_API_BASE_URL}/parent/class/add/student`;
    public static readonly PARENT_CLASS_STUDENT_LIST_FILTER = `${PROVIDER_PRIVATE_API_BASE_URL}/parent/class/student/list`;

    public static readonly PROVIDER_RECORDING_STREAM = `${PROVIDER_PRIVATE_API_BASE_URL_V2}/recording`;

    // Doubt Module Api
    public static readonly STUDENT_SUBJECT_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/student/subject/list`;
    public static readonly STUDENT_GRADE_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/student/grade/list`;
    public static readonly TEACHER_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/student/teacher/list`;
    public static readonly ADD_QUESTION = `${DOUBT_API_BASE_URL}/question`;
    public static readonly IMAGE_UPLOAD = `${DOUBT_API_BASE_URL}/question/image/upload`;
    public static readonly STUDENT_QUESTION_LIST = `${DOUBT_API_BASE_URL}/question/your/list`;
    public static readonly QUESTIN_DETAIL = `${DOUBT_API_BASE_URL}/question/details`;
    public static readonly RECEIVED_DOUBT_LIST = `${DOUBT_API_BASE_URL}/question/teacher/list`;
    public static readonly ADD_ANSWER = `${DOUBT_API_BASE_URL}/question/comment`;
    public static readonly PROVIDER_ALL_DOUBTS = `${DOUBT_API_BASE_URL}/question/provider/all`;
    public static readonly STUDENT_ALL_DOUBTS = `${DOUBT_API_BASE_URL}/question/student/all`;
    public static readonly BOOKMARK_QUESTION = `${DOUBT_API_BASE_URL}/question/bookmark`;
    public static readonly DELETE_QUESTION_ANSWER = `${DOUBT_API_BASE_URL}/question/delete`;
    public static readonly UPDATE_QUESTION_ANSWER = `${DOUBT_API_BASE_URL}/question/update`;

    // Provider assignment API
    public static readonly ASSIGNMENT_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/assignment/list`;
    public static readonly ASSIGNMENT = `${PROVIDER_PRIVATE_API_BASE_URL}/assignment`;
    public static readonly ASSIGNMENT_FILE = `${PROVIDER_PRIVATE_API_BASE_URL}/assignment/file`;
    public static readonly ASSIGNMENT_SUBMISSION_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/assignment/submissions`;
    public static readonly ASSIGNMENT_SUBMISSION_V2 = `${PROVIDER_PRIVATE_API_BASE_URL_V2}/assignment/submissions`;
    public static readonly ASSIGNMENT_V2 = `${PROVIDER_PRIVATE_API_BASE_URL_V2}/assignment`;

    // Student assignment API
    public static readonly STUDENT_ASSIGNMENT = `${STUDENT_PRIVATE_API_BASE_URL}/assignment`;
    public static readonly STUDENT_ASSIGNMENT_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/assignment`;
    public static readonly STUDENT_ASSIGNMENT_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/assignment/list`;
    public static readonly STUDENT_ASSIGNMENT_LIST_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/assignment/list`;
    public static readonly STUDENT_SUBMISSION = `${STUDENT_PRIVATE_API_BASE_URL}/assignment/submissions`;
    public static readonly STUDENT_ASSIGNMENT_FILE = `${STUDENT_PRIVATE_API_BASE_URL}/assignment/file`;

    public static readonly MATERIAL_REMOVE = `${PROVIDER_PRIVATE_API_BASE_URL}/material/delete`;
    public static readonly PROVIDER_RECORDING_ADD = `${PROVIDER_PRIVATE_API_BASE_URL}/recording/add`;
    public static readonly PROVIDER_RECORDING_EDIT = `${PROVIDER_PRIVATE_API_BASE_URL}/recording/edit`;
    public static readonly PROVIDER_RECORDING_DELETE = `${PROVIDER_PRIVATE_API_BASE_URL}/recording/deleteRecording`;

    // Student Recording API
    public static readonly STUD_RECORDING_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/recording/list`;
    public static readonly STUD_RECORDING_DETAILS = `${STUDENT_PRIVATE_API_BASE_URL}/recording`;
    public static readonly STUD_RECORDING_TEACHER_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/recording/teacher/list`;
    public static readonly STUD_RECORDING_SUB_LIST = `${STUDENT_PRIVATE_API_BASE_URL}/recording/subject/list`;

    //Dashboard
    public static readonly DASHBOARD_GET = `${PROVIDER_PRIVATE_API_BASE_URL}/dashboard`;

    // Provider assignment API
    public static readonly ATTENDANCE_LIST = `${PROVIDER_PRIVATE_API_BASE_URL}/report/class-attendance`;
    public static readonly ATTENDED_STUDENTS = `${PROVIDER_PRIVATE_API_BASE_URL}/report/class-attendance/students`;
    public static readonly STUDENT_SESSION_HISTORY = `${PROVIDER_PRIVATE_API_BASE_URL}/classes/student/session`;

    // Provider chapter management API
    public static readonly CHAPTER_MANAGEMENT_LIST = `${BASE_URL}/quiz/chapter/filter`;
    public static readonly CHAPTER = `${BASE_URL}/quiz/chapter`;
    // Student v2 Recording API
    public static readonly STUD_RECORDING_LIST_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/recording/list`;
    public static readonly STUD_RECORDING_DETAILS_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/recording`;
    public static readonly STUD_RECORDING_TEACHER_LIST_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/recording/teacher/list`;
    public static readonly STUD_RECORDING_SUB_LIST_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/recording/subject/list`;
    public static readonly STUDENT_CLASS_LIST_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/classes/list`;

    // material student API v3
    public static readonly MATERIAL_STUD_LIST_V3 = `${STUDENT_PRIVATE_API_BASE_URL_V3}/material/list`;
    public static readonly MATERIAL_STUD_DETAILS_V3 = `${STUDENT_PRIVATE_API_BASE_URL_V3}/material/detail`;
    public static readonly MATERIAL_STUD_DOWNLOAD_V3 = `${STUDENT_PRIVATE_API_BASE_URL_V3}/material/download`;
    public static readonly MATERIAL_STUD_SUB_LIST_V3 = `${STUDENT_PRIVATE_API_BASE_URL_V3}/material/subject/list`;
    public static readonly MATERIAL_STUD_DOWNLOAD_AUDIO_VIDEO_V3 = `${STUDENT_PRIVATE_API_BASE_URL_V3}/material/downloadForAudioVideo`;

    // Doubt Module Api v2
    public static readonly STUDENT_SUBJECT_LIST_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/student/subject/list`;
    public static readonly STUDENT_GRADE_LIST_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/student/grade/list`;
    public static readonly TEACHER_LIST_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/student/teacher/list`;
    public static readonly ADD_QUESTION_V2 = `${DOUBT_API_BASE_URL_V2}/question`;
    public static readonly STUDENT_QUESTION_LIST_V2 = `${DOUBT_API_BASE_URL_V2}/question/your/list`;
    public static readonly STUDENT_ALL_DOUBTS_V2 = `${DOUBT_API_BASE_URL_V2}/question/student/all`;
    public static readonly UPDATE_QUESTION_ANSWER_V2 = `${DOUBT_API_BASE_URL_V2}/question/update`;

    // Student Enroll API V2
    // public static readonly STUDENT_CLASS_LIST_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/classes/list`;
    public static readonly STUDENT_JOIN_CLASS_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/classes/joinClass`;
    public static readonly STUDENT_LEAVE_CLASS_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/classes/leaveClass`;
    public static readonly STUDENT_CLASS_DETAILS_V2 = `${STUDENT_PRIVATE_API_BASE_URL_V2}/classes/details`;

    //Provider Question Bank API
    public static readonly QUIZ_CHAPTER_LIST = `${BASE_URL}/quiz/chapter/filter`;
    public static readonly ADD_QUIZ_CHAPTER = `${BASE_URL}/quiz/chapter`;
    public static readonly QUIZ_QUESTION_LIST = `${BASE_URL}/quiz/question/filter`;
    public static readonly QUESTION_ATTACHMENT = `${BASE_URL}/quiz/question/attachment`;
    public static readonly DELETE_QUESTION_ATTACHMENT = `${BASE_URL}/quiz/question/delete/attachment`;
    public static readonly SOLUTION_ATTACHMENT = `${BASE_URL}/quiz/solution/attachment`;
    public static readonly DELETE_SOLUTION_ATTACHMENT = `${BASE_URL}/quiz/solution/delete/attachment`;
    public static readonly ANSWER_ATTACHMENT = `${BASE_URL}/quiz/answer/attachment`;
    public static readonly DELETE_ANSWER_ATTACHMENT = `${BASE_URL}/quiz/answer/delete/attachment`;
    public static readonly QUESTION = `${BASE_URL}/quiz/question`;
    public static readonly QUIZ_FOLDER_LIST = `${BASE_URL}/quiz/folder/filter`;
    public static readonly QUIZ_FOLDER_LIST_PROVIDER = `${BASE_URL}/quiz/folder/provider/filter`;
    public static readonly ADD_QUIZ_FOLDER = `${BASE_URL}/quiz/folder`;

    //Provider Practice API
    public static readonly PRACTICE_LIST = `${BASE_URL}/quiz/practise/filter`;
    public static readonly PRACTICE = `${BASE_URL}/quiz/practise`;

    // Student Practice API
    public static readonly STUDENT_PRACTICE_LIST = `${BASE_URL}/quiz/student/practise/filter`;
    public static readonly STUDENT_PRACTICE_DETAILS = `${BASE_URL}/quiz/student/practise`;
    public static readonly STUDENT_QUIZ_SUBMIT = `${BASE_URL}/quiz/submit/practise`;
    public static readonly STUDENT_BOOKMARKED_PRACTICE_LIST = `${BASE_URL}/quiz/bookmarks/practise`;
    public static readonly STUDENT_BOOKMARKED_PRACTICE_QUESTION_LIST = `${BASE_URL}/quiz/bookmarks/question`;
    public static readonly STUDENT_QUIZ_FINISH = `${BASE_URL}/quiz/finish/practise`;
    public static readonly STUDENT_PRACTICE_RESULT = `${BASE_URL}/quiz/result/practise`;
    public static readonly STUDENT_PRACTICE_DETAIL_VIEW = `${BASE_URL}/quiz/practise/details`;
    public static readonly STUDENT_QUIZ_PAUSE = `${BASE_URL}/quiz/pause/practise`;

    // Student Chapter API
    public static readonly STUDENT_CHAPTER_LIST = `${BASE_URL}/quiz/student/chapter/filter`;

    // student practice report
    public static readonly PRACTICE_REPORT = `${BASE_URL}/quiz/practise/report`;
    public static readonly PRACTICE_RESULT = `${BASE_URL}/quiz/result/practise`;

    // Provider course list
    public static readonly COURSE_LIST = `${BASE_URL}${COURSE_VERSION}/courses/list`;
    public static readonly USERS_DATA = `${BASE_URL}${COURSE_VERSION}/users`;
    public static readonly COURSE = `${BASE_URL}${COURSE_VERSION}/courses`;
    public static readonly LANGUAGE = `${BASE_URL}${COURSE_VERSION}/courses/lang`;
    public static readonly CATEGORY_LIST = `${BASE_URL}${COURSE_VERSION}/categories/list`;
    public static readonly SECTION_LIST = `${BASE_URL}${COURSE_VERSION}/sections/list`;
    public static readonly COURSE_PREVIEW = `${BASE_URL}${COURSE_VERSION}/courses`;
    public static readonly SECTION = `${BASE_URL}${COURSE_VERSION}/sections`;
    public static readonly LECTURES = `${BASE_URL}${COURSE_VERSION}/lectures`;
    public static readonly RESOURCE = `${BASE_URL}${COURSE_VERSION}/resource`;
    public static readonly SKILLS_LIST = `${BASE_URL}${COURSE_VERSION}/skills/list`;
    public static readonly TAGS_LIST = `${BASE_URL}${COURSE_VERSION}/tags/list`;
    public static readonly TAGS = `${BASE_URL}${COURSE_VERSION}/tags`;

    // Student course list
    public static readonly DISCOVER = `${BASE_URL}${COURSE_VERSION}/discover`;
    public static readonly DISCOVER_LIST = `${BASE_URL}${COURSE_VERSION}/discover/list`;
    public static readonly BOOKMARK_COURSE_LIST = `${BASE_URL}${COURSE_VERSION}/discover/bookmarks`;
    public static readonly MY_COURSES = `${BASE_URL}${COURSE_VERSION}/discover/my-courses`;
    public static readonly SUBSCRIBED = `${BASE_URL}${COURSE_VERSION}/subscribed`;

    // ENROLLED STUDENTS IN COURSE
    public static readonly ENROLLED_STUDENT_LIST = `${BASE_URL}${COURSE_VERSION}/analytics/enrolled-students`;
}
