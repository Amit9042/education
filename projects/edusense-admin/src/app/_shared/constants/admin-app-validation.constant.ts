export class CommonRegexp {
    public static readonly NUMERIC_REGEXP = '^[0-9]*$';
    public static readonly NUMERIC_SPACE_REGEXP = '^[0-9 ]*$';
    public static readonly ALPHA_NUMERIC_REGEXP = '^[A-Za-z0-9 ]*$';
    public static readonly NUMBER_REGEXP = '^[0-9.]*$';
    public static readonly NUMBER_SPACE_REGEXP = '^[0-9.]*$';
    public static readonly ALPHABETS_REGEXP = '^[A-Za-z]*$';
    public static readonly ALPHABETS_SPACE_REGEXP = '^[A-Za-z ]*$';
    public static readonly ALPHABETS_SPACE_SPACIAL_REGEXP =
        '^[A-Za-z0-9_@./#&+-]*$';
    public static readonly USER_NAME_REGEXP =
        '^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z\\d#?.!@$%^&*-]+$';
    public static readonly EMAIL_ADDRESS_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // public static readonly PASSWORD_REGEXP = /^(?=.*[a-zA-Z])(?=.*[A-Za-z])(?=.*\d)[a-zA-Z\d#?!@$%^&*-]{8,}$/;
    public static readonly PASSWORD_REGEXP =
        '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\da-zA-Z])(.{8,})$';
    public static readonly URL_COM_REGEXP =
        '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9].[^s]{2,})';
    public static readonly ALPHA_NUMERIC_SPECIAL_CHAR_REGEXP: "^[A-Za-z0-9-.,@%&!*'()/+=#?:; _]*$";
}

export const passwordRegex = {
    lowerCaseLetters: /[a-z]/g,
    upperCaseLetters: /[A-Z]/g,
    specialCharacter: /[!@#$%^&*\[\]+//(//)//_;./?:/\,\+=-]/g,
    numbers: /[0-9]/g
};

export class ValidationConstant {
    public readonly REQUIRED = ` is required`;
    public readonly VALID = `Please enter valid `;

    public readonly FIRST_NAME = `First name` + this.REQUIRED;
    public readonly FIRST_NAME_VALID = this.VALID + `first name`;
    public readonly FIRST_NAME_LENGTH = `First name length between 2 to 50 characters`;

    public readonly LAST_NAME = `Last name` + this.REQUIRED;
    public readonly LAST_NAME_VALID = this.VALID + `last name`;
    public readonly LAST_NAME_LENGTH = `Last name length between 2 to 50 characters`;

    public readonly EMAIL = `Email` + this.REQUIRED;
    public readonly EMAIL_VALID = this.VALID + `email address`;
    public readonly EMAIL_LENGTH = `Email length between 1 to 255 characters`;

    public readonly PASSWORD = `Password` + this.REQUIRED;
    public readonly PASSWORD_VALID = `Password must be alphanumeric with a special character`;
    public readonly PASSWORD_LENGTH = `Password length between 8 to 30 characters`;

    public readonly OTP = `OTP` + this.REQUIRED;
    public readonly OTP_VALID = this.VALID + `OTP`;
    public readonly OTP_LENGTH = `OTP length 6 digits only`;

    public readonly HEADLINE = `Headline` + this.REQUIRED;
    public readonly HEADLINE_VALID = this.VALID + `headline`;
    public readonly HEADLINE_LENGTH = `Headline length between 1 to 100 characters`;

    public readonly ABOUT_US = `About us` + this.REQUIRED;
    public readonly ABOUT_US_VALID = this.VALID + `about us`;
    public readonly ABOUT_US_LENGTH = `About us length between 1 to 1000 characters`;

    public readonly SPECIALITY = `Speciality` + this.REQUIRED;
    public readonly SPECIALITY_VALID = this.VALID + `Speciality`;
    public readonly SPECIALITY_LENGTH = `Speciality length between 1 to 200 characters`;

    public readonly EXPERIENCE = `Experience` + this.REQUIRED;
    public readonly EXPERIENCE_VALID = this.VALID + `experience`;

    public readonly BACHELOR = `Bachelor` + this.REQUIRED;
    public readonly BACHELOR_VALID = this.VALID + `bachelor`;
    public readonly BACHELOR_LENGTH = `Bachelor length between 1 to 100 characters`;

    public readonly MASTER = `Master` + this.REQUIRED;
    public readonly MASTER_VALID = this.VALID + `master`;
    public readonly MASTER_LENGTH = `master length between 1 to 100 characters`;

    public readonly STATE = `State` + this.REQUIRED;

    public readonly CITY = `City` + this.REQUIRED;

    public readonly COUNTRY = `Country` + this.REQUIRED;

    public readonly ROOM_NAME = `Room name` + this.REQUIRED;
    public readonly ROOM_NAME_VALID = this.VALID + `room name`;
    public readonly ROOM_NAME_LENGTH = `Password length between 1 to 100 characters`;

    public readonly LANGUAGE = `Language` + this.REQUIRED;

    public readonly FEES = `Constitution Fees` + this.REQUIRED;
    public readonly FEES_VALID = this.VALID + `constitution Fees`;

    public readonly CONTACT_NUMBER = `Contact number` + this.REQUIRED;
    public readonly CONTACT_NUMBER_VALID = this.VALID + `contact number`;
    public readonly CONTACT_NUMBER_LENGTH = `Contact number length between 7 to 14 characters`;
    public readonly REASON = `Reason` + this.REQUIRED;
    public readonly REASON_LENGTH = `Reason length between 1 to 255`;

    public readonly APPOINTMENT_DATE = `Appointment Date` + this.REQUIRED;
    public readonly APPOINTMENT_TIME = `Appointment Time` + this.REQUIRED;
    public readonly PATIENT_NAME = `Patient Name` + this.REQUIRED;

    public readonly NEW_PASSWORD = `New Password` + this.REQUIRED;
    public readonly NEW_PASSWORD_VALID = `Password must be alphanumeric with a special character`;
    public readonly NEW_PASSWORD_LENGTH = `New Password length between 8 to 30 characters`;

    public readonly CONFIRM_PASSWORD = `Confirm password` + this.REQUIRED;
    public readonly PASSWORD_DOESNT_MATCH = `Confirm password should be same as password`;

    public readonly DESCRIPTION = `Description` + this.REQUIRED;
    public readonly DESCRIPTION_LENGTH = `Description length between 2 to 1000 characters`;

    public readonly NAME = `Name` + this.REQUIRED;
    public readonly NAME_VALID = this.VALID + `name`;
    public readonly NAME_LENGTH = `Name length between 2 to 50 characters`;

    public readonly SESSION_NAME = `Session name` + this.REQUIRED;
    public readonly SESSION_NAME_VALID = this.VALID + `session name`;
    public readonly SESSION_NAME_LENGTH = `Session name length between 1 to 500 characters`;

    public readonly TEACHER_NAME = `Teacher name` + this.REQUIRED;
    public readonly TEACHER_NAME_VALID = this.VALID + `teacher name`;
    public readonly TEACHER_NAME_LENGTH = `Teacher name length between 2 to 50 characters`;

    public readonly COLLEGE =
        `College/Tuition/School/Institute` + this.REQUIRED;
    public readonly GRADE = `Grade` + this.REQUIRED;
    public readonly BOARD = `Board` + this.REQUIRED;
    public readonly MEDIUM = `Medium` + this.REQUIRED;
    public readonly SUBJECT = `Subject` + this.REQUIRED;
    public readonly STANDARD = `Standard` + this.REQUIRED;

    public readonly START_TIME = `Start Time` + this.REQUIRED;
    public readonly END_TIME = `End Time` + this.REQUIRED;

    public readonly TIME_ZONE = `Time zone` + this.REQUIRED;
    public readonly DAYS = `Days` + this.REQUIRED;
    public readonly ASSIGN_CLASS = `Assign class` + this.REQUIRED;

    public readonly ADDRESS_LENGTH = `Password length between 1 to 500 characters`;

    public readonly POSITION = `Position` + this.REQUIRED;
    public readonly POSITION_VALID = this.VALID + `position`;
    public readonly POSITION_LENGTH = `Position length between 3 to 100 characters`;

    public readonly MOBILE_NUMBER = `Mobile number` + this.REQUIRED;
    public readonly MOBILE_NUMBER_VALID = this.VALID + `mobile number`;
    public readonly MOBILE_NUMBER_LENGTH = `Mobile number length between 7 to 14 characters`;

    public readonly PARENTS_EMAIL = `Parent's Email` + this.REQUIRED;
    public readonly PARENTS_EMAIL_VALID = this.VALID + `parent's email address`;
    public readonly PARENTS_EMAIL_LENGTH = `Email length between 1 to 255 characters`;

    public readonly END_TIME_VALID = `End time must be greater than Start time`;

    public readonly ROLE = `Role` + this.REQUIRED;

    public readonly GENDER = `Gender` + this.REQUIRED;

    public readonly COLLEGE_NAME_VALID =
        this.VALID + 'College/Tution/Institute name.';
    public readonly COLLEGE_NAME_LENGTH = `College/Tution/Institute length between 1 to 255 characters`;
    public readonly CODE = `Code` + this.REQUIRED;

    public readonly PROVIDER_NAME = `Provider name` + this.REQUIRED;
    public readonly PROVIDER_NAME_VALID = this.VALID + `provider name`;
    public readonly PROVIDER_NAME_LENGTH = `Provider Name length between 2 to 50 characters`;

    public readonly TYPE = `Type` + this.REQUIRED;

    public readonly BROADCAST_MESSAGE = `Broadcast message` + this.REQUIRED;
    public readonly BROADCAST_MESSAGE_LENGTH = `Broadcast message length between 2 to 150 characters`;
}
