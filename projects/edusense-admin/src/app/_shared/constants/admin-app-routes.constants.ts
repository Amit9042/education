export class AdminRouteConstant {
    // Common constant
    public static readonly ADD = 'add';
    public static readonly EDIT = 'edit';
    public static readonly VIEW = 'view';
    public static readonly LIST = 'list';
    public static readonly PROVIDER_MODULE_ROUTE = 'provider';
    public static readonly BROADCAST_MODULE = 'broadcast';

    public static readonly LOGIN_ROUTE = `login`;
    public static readonly FORGOT_EMAIL_ROUTE = `forgot-email`;

    public static readonly PROVIDER_LIST_ROUTE = `${AdminRouteConstant.LIST}`;
    public static readonly PROVIDER_LIST = `${AdminRouteConstant.PROVIDER_MODULE_ROUTE}/${AdminRouteConstant.PROVIDER_LIST_ROUTE}`;

    public static readonly PROVIDER_VIEW_ROUTE = `${AdminRouteConstant.VIEW}`;
    public static readonly PROVIDER_VIEW = `${AdminRouteConstant.PROVIDER_MODULE_ROUTE}/${AdminRouteConstant.PROVIDER_VIEW_ROUTE}`;
}

export const PUBLIC_ROUTES = ['/' + AdminRouteConstant.LOGIN_ROUTE];
