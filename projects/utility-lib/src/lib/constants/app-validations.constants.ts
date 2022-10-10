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
    public static readonly PHONE_REGEXP = '^[0-9-+]*$';
}

export class ValidationConstant {
    public readonly REQUIRED = ` is required`;
    public readonly VALID = `Please enter valid `;

    public readonly ANSWER = `Answer` + this.REQUIRED;
    public readonly ANSWER_LENGTH = `Answer length between 2 to 1000 characters`;

}
