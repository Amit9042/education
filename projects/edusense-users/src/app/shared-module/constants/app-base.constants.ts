import { environment } from '../../../environments/environment';

export enum HttpMethodsTypeEnum {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PUT_MULTIPART = 'putMultiPart',
    POST_MULTIPART = 'postMultiPart',
    POST_MULTIPART_UNIQUE = 'postMultiPartUnique'
}

export const PAGE_SIZE_OPTIONS = [20, 50, 100];

export enum HttpStatus {
    SUCCESS = 200,
    UNAUTHORIZED = 401,
    EXPIRED = 450,
    PROVIDER_UUID_REQUIRE = 425
}

export enum EnvironmentEnum {
    LOCAL = 'local',
    DEV = 'dev',
    QA = 'qa',
    DEMO = 'demo',
    PROD = 'prod'
}

export enum SortingEnum {
    ASCENDING = 'ASC',
    DESCENDING = 'DESC'
}

export enum StatusTypeEnum {
    Enable = 0,
    Disable = 1
}

export const StatusType = {
    true: 'Enable',
    false: 'Disable'
};

export const FAKE_USER_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export enum FileSizeEnum {
    TWENTY_MB_IMAGE_SIZE = 20000000,
    TWO_HUNDRED_MB_IMAGE_SIZE = 200000000,
    FIVE_MB_IMAGE_SIZE = 5000000,
    TEN_MB_IMAGE_SIZE = 10000000,
    FOUR_GB_SIZE = 4294965097
}

export enum RequestTypeEnum {
    Normal = 1,
    Emergency = 2
}

export const REQUEST_TYPE = [
    { key: 'Normal', value: 1 },
    { key: 'Emergency', value: 2 }
];

export enum RequestStatusEnum {
    PENDING = 1,
    APPROVED = 2,
    REJECTED = 3,
    CANCELLED = 4,
    CLOSED = 5
}

export const REQUEST_STATUS = [
    { key: 'Pending', value: 1 },
    { key: 'Approved', value: 2 },
    { key: 'Rejected', value: 3 },
    { key: 'Cancelled', value: 4 },
    { key: 'Closed', value: 5 }
];

export enum ConferenceStatusEnum {
    CREATED = 1,
    ONGOING = 2,
    ENDED = 3,
    RESCHEDULED = 4
}

export const CONFERENCE_STATUS = [
    { key: 'Created', value: 1 },
    { key: 'Ongoing', value: 2 },
    { key: 'Ended', value: 3 },
    { key: 'Re-scheduled', value: 4 }
];

export enum GenderEnum {
    Male = 0,
    Female = 1
}

export const GENDER_LIST = [
    { key: 'Male', value: 0 },
    { key: 'Female', value: 1 }
];

export const DAYS_LIST = [
    { name: 'Monday', id: 1 },
    { name: 'Tuesday', id: 2 },
    { name: 'Wednesday', id: 3 },
    { name: 'Thursday', id: 4 },
    { name: 'Friday', id: 5 },
    { name: 'Saturday', id: 6 },
    { name: 'Sunday', id: 7 }
];

export enum UserTypeEnum {
    STUDENT = 1,
    PROVIDER = 2
}

export enum EnrollStatusEnum {
    ALL = 0,
    PENDING = 1,
    ACCEPETD = 2,
    REJECTED = 3
}

export const EnrollmentStatusList = [
    { title: 'All', value: EnrollStatusEnum.ALL },
    { title: 'Pending', value: EnrollStatusEnum.PENDING },
    { title: 'Accepted', value: EnrollStatusEnum.ACCEPETD },
    { title: 'Rejected', value: EnrollStatusEnum.REJECTED }
];

export enum ViewType {
    Loading = 1,
    NoData = 2,
    Data = 3
}

export const ALLOWED_MATERIAL_FILE_TYPES = [
    { name: 'image/png', icon: 'png' },
    { name: 'image/jpeg', icon: 'jpeg' },
    { name: 'image/jpg', icon: 'jpg' },
    { name: 'application/pdf', icon: 'pdf' },
    { name: 'application/vnd.ms-excel', icon: 'excel' },
    {
        name:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        icon: 'excel'
    },
    { name: 'application/vnd.ms-powerpoint', icon: 'ppt' },
    {
        name:
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        icon: 'ppt'
    },
    { name: 'application/msword', icon: 'doc' },
    {
        name:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        icon: 'doc'
    },
    { name: 'text/plain', icon: 'txt' },
    { name: 'audio/mpeg', icon: 'audio-file' },
    { name: 'audio/vnd.wave,', icon: 'audio-file' },
    { name: 'audio/wav', icon: 'audio-file' },
    { name: 'audio/wave', icon: 'audio-file' },
    { name: 'audio/x-wav', icon: 'audio-file' },
    { name: 'video/x-ms-wma', icon: 'video-file' },
    { name: 'video/mp4', icon: 'video-file' },
    { name: 'application/x-troff-msvideo', icon: 'video-file' },
    { name: 'video/avi', icon: 'video-file' },
    { name: 'video/msvideo', icon: 'video-file' },
    { name: 'video/x-msvideo', icon: 'video-file' },
    { name: 'video/quicktime', icon: 'video-file' },
    { name: 'video/x-flv', icon: 'video-file' },
    { name: 'video/webm', icon: 'video-file' },
    { name: 'video/x-ms-wmv', icon: 'video-file' },
    { name: 'application/zip', icon: 'zip' },
    { name: 'application/octet-stream', icon: 'zip' },
    { name: 'application/vnd.rar', icon: 'zip' },
    { name: 'application/x-zip', icon: 'zip' },
    { name: 'video/youtube', icon: 'youtube' }
];

// Allowed resource file types
export const ALLOWED_RESOURCES_FILE_TYPES: any = [
    { name: 'application/pdf', icon: 'pdf' },
    { name: 'text/plain', icon: 'txt' },
    { name: 'application/vnd.ms-powerpoint', icon: 'ppt' },
    {
        name:
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        icon: 'ppt'
    },
    { name: 'application/vnd.ms-excel', icon: 'excel' },
    {
        name:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        icon: 'excel'
    },
    { name: 'image/png', icon: 'png' },
    { name: 'image/jpeg', icon: 'jpeg' },
    { name: 'image/jpg', icon: 'jpg' },
    { name: 'application/msword', icon: 'doc' },
    {
        name:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        icon: 'doc'
    },
    { name: 'audio/mpeg', icon: 'audio-file' },
    { name: 'audio/vnd.wave,', icon: 'audio-file' },
    { name: 'audio/wav', icon: 'audio-file' },
    { name: 'audio/wave', icon: 'audio-file' },
    { name: 'audio/x-wav', icon: 'audio-file' }
];

export const PUBNUB = {
    STUDENT_SUB_KEY: environment.pubnubStudentSubKey,
    PROVIDER_SUB_KEY: environment.pubnubProviderSubKey,
    CONNECTION_STATUS: 'PNConnectedCategory',
    DIS_CONNECTION_STATUS: 'PNUnexpectedDisconnectCategory',
    RE_CONNECT_STATUS: 'PNReconnectedCategory',
    TIMEOUT: 'PNTimeoutCategory',
    STATUS_CODE_504: 504
};

export const NotificationTemplate = {
    PROVIDER_JOINED: 'PROVIDER_JOINED',
    PROVIDER_LEFT: 'PROVIDER_LEFT',
    PROVIDER_MATERIAL_ADD: 'PROVIDER_MATERIAL_ADD',
    STUDENT_REMOVED: 'STUDENT_REMOVED',
    STUDENT_ENROLL_STATUS_ACCEPTED: 'STUDENT_ENROLL_STATUS_ACCEPTED',
    PARENT_CLASS_ASSIGN_STUDENT: 'PARENT_CLASS_ASSIGN_STUDENT'
};

export const ALLOWED_MATERIAL_EXCEL_FILE_TYPES: string[] = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export const ALLOWED_MATERIAL_DOC_FILE_TYPES: string[] = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const ALLOWED_MATERIAL_PPT_FILE_TYPES: string[] = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];
export const ALLOWED_MATERIAL_AUDIO_FILE_TYPES: string[] = [
    'audio/mpeg',
    'audio/vnd.wave,',
    'audio/wav',
    'audio/wave',
    'audio/x-wav'
];
export const ALLOWED_MATERIAL_PDF_FILE_TYPES: string[] = ['application/pdf'];
export const ALLOWED_MATERIAL_TXT_FILE_TYPES: string[] = ['text/plain'];
export const ALLOWED_MATERIAL_ZIP_FILE_TYPES: string[] = [
    'application/zip',
    'application/octet-stream',
    'application/vnd.rar',
    'application/x-zip'
];
export const ALLOWED_MATERIAL_IMAGE_FILE_TYPES: string[] = [
    'image/png',
    'image/jpeg',
    'image/jpg'
];
export const ALLOWED_MATERIAL_VIDEO_FILE_TYPES: string[] = [
    'video/x-ms-wma',
    'video/mp4',
    'application/x-troff-msvideo',
    'video/avi',
    'video/msvideo',
    'video/x-msvideo',
    'video/quicktime',
    'video/x-flv',
    'video/webm',
    'video/x-ms-wmv',
    'video/youtube'
];

export const ALLOWED_MATERIAL_YOUTUBE_FILE_TYPES: string[] = ['video/youtube'];

export const CHANGE_MATERIAL_VIDEO_FILE_TYPES: any = [
    { name: 'video/quicktime', use: 'video/mp4' }
];

export const TIME_SLOT_LIST = [
    { label: '12:00 am', value: '00:00' },
    { label: '12:30 am', value: '00:30' },
    { label: '1:00 am', value: '01:00' },
    { label: '1:30 am', value: '01:30' },
    { label: '2:00 am', value: '02:00' },
    { label: '2:30 am', value: '02:30' },
    { label: '3:00 am', value: '03:00' },
    { label: '3:30 am', value: '03:30' },
    { label: '4:00 am', value: '04:00' },
    { label: '4:30 am', value: '04:30' },
    { label: '5:00 am', value: '05:00' },
    { label: '5:30 am', value: '05:30' },
    { label: '6:00 am', value: '06:00' },
    { label: '6:30 am', value: '06:30' },
    { label: '7:00 am', value: '07:00' },
    { label: '7:30 am', value: '07:30' },
    { label: '8:00 am', value: '08:00' },
    { label: '8:30 am', value: '08:30' },
    { label: '9:00 am', value: '09:00' },
    { label: '9:30 am', value: '09:30' },
    { label: '10:00 am', value: '10:00' },
    { label: '10:30 am', value: '10:30' },
    { label: '11:00 am', value: '11:00' },
    { label: '11:30 am', value: '11:30' },
    { label: '12:00 pm', value: '12:00' },
    { label: '12:30 pm', value: '12:30' },
    { label: '1:00 pm', value: '13:00' },
    { label: '1:30 pm', value: '13:30' },
    { label: '2:00 pm', value: '14:00' },
    { label: '2:30 pm', value: '14:30' },
    { label: '3:00 pm', value: '15:00' },
    { label: '3:30 pm', value: '15:30' },
    { label: '4:00 pm', value: '16:00' },
    { label: '4:30 pm', value: '16:30' },
    { label: '5:00 pm', value: '17:00' },
    { label: '5:30 pm', value: '17:30' },
    { label: '6:00 pm', value: '18:00' },
    { label: '6:30 pm', value: '18:30' },
    { label: '7:00 pm', value: '19:00' },
    { label: '7:30 pm', value: '19:30' },
    { label: '8:00 pm', value: '20:00' },
    { label: '8:30 pm', value: '20:30' },
    { label: '9:00 pm', value: '21:00' },
    { label: '9:30 pm', value: '21:30' },
    { label: '10:00 pm', value: '22:00' },
    { label: '10:30 pm', value: '22:30' },
    { label: '11:00 pm', value: '22:00' },
    { label: '11:30 pm', value: '23:30' }
];

export enum NotificationTypeEnum {
    ALL = 1,
    NEW = 3,
    EARLIER = 2
}

export const FILE_SIZE_ALLOWED = [{ name: 'video-file', size: 200 }];

// Search opeator constants
export enum OperatorEnum {
    CONTAIN = 'like',
    NOT_CONTAIN = '!like',
    EQUALS = '=',
    NOT_EQUAL = '!=',
    IN = 'in',
    NOT_IN = '!in',
    GREATER_THAN = '>',
    LESSER_THAN = '<',
    GREATER_EQUALS = '>=',
    LESSER_EQUALS = '<=',
    TRUE = 'is_true',
    FALSE = 'is_false',
    NULL = 'is_null',
    NOT_NULL = '!is_null'
}

export enum RoleMaster {
    STUDNET = 1,
    PROVIDER_OWNER = 2,
    PROVIDER_ADMIN = 3,
    TEACHER = 4
}

export const CLASS_SESSION_STATUS = {
    CREATED: 1,
    STARTED: 2,
    COMPLETED: 3
};

export enum UserRoleStatus {
    NOT_COMPLETED = 1,
    PENDING = 2,
    APPROVED = 3,
    REJECTED = 4
}

export const MIXPANEL = {
    TOKEN: environment.mixpanelToken,
    TYPE: environment.envType
};

export const MIXPANEL_EVENTS = {
    SIGNUP_BASIC: 'Provider - Sign Up',
    SIGNUP_BUILD_PROFILE: 'Provider - Sign Up Build Profile',
    SIGNUP_VERIFY_EMAIL: 'Provider - Sign Up Verify Email',
    SIGNIN: 'Provider - Sign In',
    SINGOUT: 'Provider - Sign out',
    FORGOT_PASSWORD: 'Provider - Forgot Password',
    FORGOT_PASSWORD_VERIFY: 'Provider - Forgot Password Verify Code',
    FORGOT_PASSWORD_NEW_PASS: 'Provider - Forgot Password New Password',
    DASHBOARD_VIEW: 'Provider - Dashboard View',
    NOTIFICATION_LIST: 'Provider - Notification List',
    SETTING_DRAWER: 'Provider - Setting Drawer',
    GO_LIVE_LIST: 'Provider - Go live List',
    ENROLL_VIEW: 'Provider - Enroll View',
    PROFILE_VIEW: 'Provider - Profile View',
    EDIT_PROFILE_VIEW: 'Provider - Edit Profile View',
    USER_MANAG_LIST: 'Provider - User Management List',
    USER_MANAG_INVITE_VIEW: 'Provider - User Management Invite View',
    USER_MANAG_EDIT_VIEW: 'Provider - User Management Edit View',
    USER_MANAG_DETAIL: 'Provider - User Management Detail View',
    ROLE_MANAG_LIST: 'Provider - Role Management List',
    ROLE_MANAG_DETAIL: 'Provider - Role Management Detail View',
    CHANGE_PASSWORD: 'Provider - Change Password View',
    CLASS_LIST: 'Provider - Class List',
    CLASS_ADD_VIEW: 'Provider - Class Add View',
    CLASS_EDIT_VIEW: 'Provider - Class Edit View',
    CLASS_DETAIL: 'Provider - Class Detail View',
    CLASS_ENABLE_DISABLE: 'Provider - Class Enable/Disable View',
    CLASS_ADD_STUD_VIEW: 'Provider - Class Add Student View',
    CLASS_CLONE_VIEW: 'Provider - Class Clone',
    STUDENT_ADD_VIEW: 'Provider - Student List',
    STUDENT_DETAIL: 'Provider - Student Detail View',
    MATERIAL_GRADE_LIST: 'Provider - Material Grade List',
    MATERIAL_SUB_LIST: 'Provider - Material Subject List',
    MATERIAL_LIST: 'Provider - Material List',
    MATERIAL_ADD: 'Provider - Material Add View',
    MATERIAL_EDIT: 'Provider - Material Edit View',
    MATERIAL_DETAIL: 'Provider - Material Detail View',
    MATERIAL_ENABLE_DISABLE: 'Provider - Material Enable/Disable View',

    SIGNUP_BASIC_STUD: 'Student - Sign Up',
    SIGNUP_VERIFY_MOB_STUD: 'Student - Sign Up Verify Mobile',
    SIGNUP_BUILD_PROFILE_STUD: 'Student - Sign Up Build Profile',
    SIGNIN_STUD: 'Student - Sign In',
    SINGOUT_STUD: 'Student - Sign out',
    FORGOT_PASSWORD_STUD: 'Student - Forgot Password',
    FORGOT_PASSWORD_VERIFY_STUD: 'Student - Forgot Password Verify Code',
    FORGOT_PASSWORD_NEW_PASS_STUD: 'Student - Forgot Password New Password',
    JOIN_CLASS_LIST: 'Student - Join Class List',
    PROFILE_VIEW_STUD: 'Student - Profile View',
    EDIT_PROFILE_VIEW_STUD: 'Student - Edit Profile View',
    CHANGE_PASSWORD_STUD: 'Student - Change Password View',
    NOTIFICATION_LIST_STUD: 'Student - Notification List',
    SETTING_DRAWER_STUD: 'Student - Setting Drawer',
    ENROLL_CLASS_VIEW: 'Student - Enroll Class View',
    ENROLLMENT_STATUS_VIEW: 'Student - Enrollment Status View',
    DASHBOARD_VIEW_STUD: 'Student - Dashboard View',
    PRACTICE_VIEW_STUD: 'Student - Practice View',
    MATERIAL_SUB_LIST_STUD: 'Student - Material Subject List',
    MATERIAL_LIST_STUD: 'Student - Material List'
};

export const MATERIAL_TYPE = {
    File: 1,
    Youtube: 2
};

export const REDIRECTION_FROM = {
    YourDoubts: 1,
    BookmarkedDoubts: 2,
    AllDoubts: 3
};

export enum UploadStatus {
    PENDING = 'Pending',
    UPLADING = 'Uploding',
    COMPLETED = 'Completed',
    FAILED = 'Failed'
}

export const AssignmentRedirect = {
    All_ASSIGNMENT: 'allAssignment'
};

export enum DifficultyLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export enum QuestionType {
    SINGLE = 1,
    MULTI = 2,
    BOOLEAN = 3
}

export const DifficultyLevelList = [
    { id: 'LOW', value: 'Low' },
    { id: 'MEDIUM', value: 'Medium' },
    { id: 'HIGH', value: 'High' }
];

export const QuestionTypeList = [
    { id: 1, value: 'Single Answer Selection' },
    { id: 2, value: 'Multiple Answer Selection' },
    { id: 3, value: 'True/False' }
];

export const ChildHeaderRoutes = ['/join-class', '/student-recorded-session'];

export enum ContentTypeViewEnum {
    VIDEO_TYPE_CONTENT = 'videoTypeContent',
    DESCRIPTION_TYPE_CONTENT = 'descriptionTypeContent',
    LINK_TYPE_CONTENT = 'linkTypeContent',
    FILE_TYPE_CONTENT = 'fileTypeContent'
}

// Content type
export const CONTENT_TYPE = {
    FILE: 1,
    TEXT: 2,
    VIDEO: 3,
    YOUTUBE_LINK: 4
};

// Allowed lecture file types
export const ALLOWED_LECTURE_FILE_TYPES: any = [
    { name: 'application/pdf', icon: 'pdf' }
];

export const VIDEO_FILES_TYPES = [
    'mp4',
    'avi',
    'mov',
    'flv',
    'webm',
    'mpeg',
    'wmv'
];

// Course status
export const COURSE_STATUS = {
    DRAFT: 1,
    PUBLISHED: 2,
    ARCHIVED: 3
};
