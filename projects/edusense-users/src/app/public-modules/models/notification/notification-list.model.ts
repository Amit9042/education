export interface NotificationList {
    _id: string;
    to_user_id: number;
    to_user_app_type_id: number;
    entity_id: number;
    avatar: string[];
    template: Template;
    params: Object;
    payload: Object;
    is_read: boolean;
    is_viewed: boolean;
    is_deleted: boolean;
    created_at: string;
}

export interface Template {
    _id: string;
    template_attributes: TemplateAttributes[];
    web_redirect_attributes: WebRedirectAttributes[];
}

export interface TemplateAttributes {
    key: string;
    value: string;
}

export interface WebRedirectAttributes {
    key: string;
    value: string;
}

export interface Entities {
    _id: string;
    avatar: string;
    id: string;
    name: string;
    type: string;
}

export interface Templates {
    _id: string;
    android_fallback_url: string;
    android_redirect: string;
    default_image: string;
    en: string;
    ge: string;
    ios_fallback_url: string;
    ios_redirect: string;
    web_fallback_url: string;
    web_redirect: string;
    is_background: boolean;
}

export interface Notification {
    _id: string;
    html: string;
    isView: boolean;
    isRead: boolean;
    avatar: string;
    date: string;
    redirectUrl: string;
    payload: Object;
    templateName: string;
}
