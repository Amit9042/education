import { environment } from '../../../environments/environment';

export enum USER_TYPE {
    PROVIDER = '/provider',
    STUDENT = '/student',
    ADMIN = '/admin'
}

const BASE_URL = environment.apiUrl;
const PUBLIC = '/public';
const VERSION = '/api/v1';
const VERSION_2 = '/api/v2';

const ADMIN_PUBLIC_API_BASE_URL = BASE_URL + USER_TYPE.ADMIN + PUBLIC + VERSION;

const ADMIN_PRIVATE_API_BASE_URL = BASE_URL + USER_TYPE.ADMIN + VERSION;

export class AdminApi {
    // Authentication Module Api's
    public static readonly LOGIN = `${ADMIN_PUBLIC_API_BASE_URL}/login`;

    // provider Module Api's
    public static readonly PROVIDER_LIST = `${ADMIN_PRIVATE_API_BASE_URL}/admin/provider/list`;
    public static readonly ENABLE_DISABLE_PROVIDER = `${ADMIN_PRIVATE_API_BASE_URL}/admin/toggleProvider`;
    public static readonly APPROVE_REJECT_PROVIDER = `${ADMIN_PRIVATE_API_BASE_URL}/admin/action`;

    //Broadcast Module Api's
    public static readonly BROADCAST_MESSAGE = `${ADMIN_PRIVATE_API_BASE_URL}/admin/broadcast/notification`;
}
