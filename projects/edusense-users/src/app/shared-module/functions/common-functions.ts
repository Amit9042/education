import { environment } from '../../../environments/environment';
import {
    AppMessageConstants,
    BroswersEnum,
    EnvironmentEnum,
    StatusTypeEnum,
    UserRoleStatus,
    UserTypeEnum
} from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';
import * as FileSaver from 'file-saver';
import * as _moment from 'moment';

const moment = _moment;

export const appLogger = (message?: any, ...optionalParams: any[]) => {
    if (
        environment.envType === EnvironmentEnum.LOCAL ||
        environment.envType === EnvironmentEnum.DEV
    ) {
        console.log(message, ...optionalParams);
    }
};

export const isEmpty = (obj): boolean => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export function isValidExcelAndCSVFile(filename: string): boolean {
    return (
        filename ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        filename === 'application/vnd.ms-excel' ||
        filename === 'text/csv'
    );
}

export function isValidImageType(filename: string): boolean {
    return (
        filename === 'image/png' ||
        filename === 'image/jpeg' ||
        filename === 'image/jpg'
    );
}

export function isValidPdfType(filename: string): boolean {
    return filename === 'application/pdf';
}

export function statusType(params: any) {
    return params === 1 ? 'active' : params === 0 ? 'inactive' : '-';
}

export function getClassForStatusType(type: any) {
    type = type ? 0 : 1;
    switch (type) {
        case StatusTypeEnum.Disable:
            return 'red-color';

        case StatusTypeEnum.Enable:
            return 'green-color';
    }
}

export const saveFile = (response, fileName) => {
    FileSaver.saveAs(response, fileName);
};

/* tslint:disable:no-string-literal */
export const getQueryParams = (
    search: any,
    sort?: any,
    rowNumber?: number,
    recordsPerPage?: number,
    showAll = false
) => {
    const params = {};
    if (!isEmpty(search)) {
        params['search'] = JSON.stringify(search);
    }
    if (sort && sort.active && sort.direction) {
        params['sortOrder'] = sort.direction;
        params['sortBy'] = sort.active;
    }
    if (rowNumber && recordsPerPage) {
        params['rowNumber'] = rowNumber;
        params['recordsPerPage'] = recordsPerPage;
    }
    params['showAll'] = showAll;
    return params;
};

/* tslint:enable:no-string-literal */

export function removeEmptyCriterias(criterias: any[]) {
    const criteriaCopy = JSON.parse(JSON.stringify(criterias));
    const finalCriterias = [];
    if (criteriaCopy && criteriaCopy.length) {
        criteriaCopy.forEach((criteria, index) => {
            if (criteria.operator === 'status') {
                if (
                    criteria.values[0] === 'is_true' ||
                    criteria.values[0] === 'is_false'
                ) {
                    criteria.operator = criteria.values[0];
                    delete criteria.values;
                    finalCriterias.push(criteria);
                }
            } else {
                const empty = checkIfEmptyCriteriaValue(criteria.values);
                if (!empty) {
                    finalCriterias.push(criteria);
                }
            }
        });
    }
    return finalCriterias;
}

function checkIfEmptyCriteriaValue(value): boolean {
    if (Array.isArray(value)) {
        if (checkEmptyValue(value)) {
            return true;
        } else {
            value.forEach(record => {
                removeEmptyFields(record);
            });
            value = value.filter(v => !checkEmptyValue(v));
            if (checkEmptyValue(value)) {
                return true;
            }
        }
    } else if (typeof value === 'object') {
        if (checkEmptyValue(value)) {
            return true;
        }
        const newValue = removeEmptyFields(value);
        if (checkEmptyValue(newValue)) {
            return true;
        }
    } else {
        if (checkEmptyValue(value)) {
            return true;
        }
    }
    return false;
}

export function removeEmptyFields(params: any) {
    for (const field of Object.keys(params)) {
        if (params.hasOwnProperty(field)) {
            if (Array.isArray(params[field])) {
                if (checkEmptyValue(params[field])) {
                    delete params[field];
                } else {
                    params[field].forEach(record => {
                        removeEmptyFields(record);
                    });
                    params[field] = params[field].filter(
                        value => !checkEmptyValue(value)
                    );
                    if (checkEmptyValue(params[field])) {
                        delete params[field];
                    }
                }
            } else if (typeof params[field] === 'object') {
                if (checkEmptyValue(params[field])) {
                    delete params[field];
                } else {
                    removeEmptyFields(params[field]);
                    if (checkEmptyValue(params[field])) {
                        delete params[field];
                    }
                }
            } else {
                if (checkEmptyValue(params[field])) {
                    delete params[field];
                }
            }
        }
    }
    return params;
}

export function checkEmptyValue(value) {
    if (value === null || value === undefined) {
        return true;
    } else if (typeof value === 'string' && value === '') {
        return true;
    } else if (Array.isArray(value) && value.length === 0) {
        return true;
    } else if (
        value.constructor === Object &&
        Object.entries(value).length === 0
    ) {
        return true;
    }
    return false;
}

export const trunkTrailString = (str: string, displayLength: number) => {
    return (
        str &&
        (str.length > displayLength
            ? `${str.substr(0, displayLength)}...`
            : str)
    );
};

export const getBrowserName = () => {
    let sBrowser,
        sUsrAg = navigator.userAgent.toLowerCase();
    // The order matters here, and this may report false positives for unlisted browsers.
    if (sUsrAg.indexOf(BroswersEnum.FireFox) > -1) {
        sBrowser = BroswersEnum.FireFox;
        // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
    } else if (sUsrAg.indexOf(BroswersEnum.SamsungBrowser) > -1) {
        sBrowser = BroswersEnum.SamsungBrowser;
        // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
    } else if (
        sUsrAg.indexOf(BroswersEnum.OPERA) > -1 ||
        sUsrAg.indexOf('OPR') > -1
    ) {
        sBrowser = BroswersEnum.OPERA;
        // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
    } else if (sUsrAg.indexOf(BroswersEnum.IE) > -1) {
        sBrowser = BroswersEnum.IE;
        // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
    } else if (sUsrAg.indexOf(BroswersEnum.EDGE) > -1) {
        sBrowser = BroswersEnum.EDGE;
        // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    } else if (sUsrAg.indexOf(BroswersEnum.CHROME) > -1) {
        sBrowser = BroswersEnum.CHROME;
        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    } else if (sUsrAg.indexOf(BroswersEnum.SAFARI) > -1) {
        sBrowser = BroswersEnum.SAFARI;
        // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
    } else {
        sBrowser = 'unknown';
    }
    return sBrowser;
};

export const hours24TimeConvert = time => {
    // Check correct time format and split into components
    time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    delete time[3];
    return time.join(''); // return adjusted time or original string
};

export const bytesToSizeInMB = (bytes: number) => {
    const ut = 1024 * 1024;
    const decimal = 3;
    return +(bytes / ut).toFixed(decimal);
};

export function notificationFormatedTime(currentTime, createdTime): string {
    const onePlusYear = '1+ year';
    const onePlusMonth = '1+ month';
    const threePlusMonth = '3+ month';
    const oneWeekAgo = '1 week ago';
    const twoWeekAgo = '2 weeks ago';
    const threeWeekAgo = '3 weeks ago';
    const dayAgo = 'day ago';
    const daysAgo = 'days ago';
    const hourAgo = 'hour ago';
    const hoursAgo = 'hours ago';
    const minuteAgo = 'minute ago';
    const minutesAgo = 'minutes ago';
    const justNow = 'Just now';

    const startdateMoment = moment(createdTime);
    const enddateMoment = moment(currentTime);
    const diff = moment.duration(enddateMoment.diff(startdateMoment));
    const years = Math.floor(diff.asYears());
    const months = Math.floor(diff.asMonths());
    const days = Math.floor(diff.asDays());
    const hourDiff = Math.floor(diff.asHours());
    const minDiff = Math.floor(diff.asMinutes());
    if (years > 0 || months > 0 || days > 0) {
        if (years > 0) {
            return onePlusYear;
        } else {
            if (months > 0) {
                if (months >= 1 && months < 3) {
                    return onePlusMonth;
                } else if (months >= 3) {
                    return threePlusMonth;
                }
            } else {
                if (days >= 21) {
                    return threeWeekAgo;
                } else if (days >= 14 && days < 21) {
                    return twoWeekAgo;
                } else if (days >= 7 && days < 14) {
                    return oneWeekAgo;
                } else if (days >= 1 && days <= 6) {
                    if (days === 1) {
                        return `${days} ${dayAgo}`;
                    } else {
                        return `${days} ${daysAgo}`;
                    }
                }
            }
        }
    } else {
        if (hourDiff >= 1) {
            if (hourDiff === 1) {
                return `${hourDiff} ${hourAgo}`;
            } else {
                return `${hourDiff} ${hoursAgo}`;
            }
        } else if (minDiff >= 1) {
            if (minDiff === 1) {
                return `${minDiff} ${minuteAgo}`;
            } else {
                return `${minDiff} ${minutesAgo}`;
            }
        } else {
            return justNow;
        }
    }
}

// tslint:disable-next-line: ban-types
export function parseQueryString(str: string): Object {
    const ret: { [k: string]: string[] | string } = Object.create(null);

    if (typeof str !== 'string') {
        return ret;
    }

    str = str.trim().replace(/^(\?|#|&)/, '');

    if (!str) {
        return ret;
    }

    str.split('&').forEach(param => {
        const parts = param.replace(/\+/g, ' ').split('=');
        // Firefox (pre 40) decodes `%3D` to `=`
        // https://github.com/sindresorhus/query-string/pull/37
        let key = parts.shift();
        let val = parts.length > 0 ? parts.join('=') : undefined;

        key = decodeURIComponent(key);

        // missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        val = val === undefined ? null : decodeURIComponent(val);

        const retVal = ret[key];
        if (ret[key] === undefined) {
            ret[key] = val;
        } else if (Array.isArray(retVal)) {
            retVal.push(val);
        } else {
            ret[key] = [ret[key] as string, val];
        }
    });
    return ret;
}

// Parses the url and gets the access token if it is in the urls hash
export function getAccessTokenFromUrl(): string {
    return parseQueryString(window.location.hash)['access_token'] as string;
}

export function getTotalDuration(seconds: number) {
    let hours;
    let minutes;
    hours = Math.floor(seconds / 3600);
    minutes = Math.floor((seconds % 3600) / 60);
    seconds = Math.floor((seconds % 3600) % 60);
    return `${hours} hr ${minutes} min ${seconds} sec`;
}

export function getVideoDuration(seconds: number) {
    let hours;
    let minutes;
    let sec;
    hours = Math.floor(seconds / 3600);
    minutes = Math.floor((seconds % 3600) / 60);
    sec = Math.floor((seconds % 3600) % 60);
    const hoursView = hours < 10 ? `0${hours}` : hours;
    const minutesView = minutes < 10 ? `0${minutes}` : minutes;
    const secView = sec < 10 ? `0${sec}` : sec;
    return hours > 0
        ? `${hoursView}:${minutesView}:${secView}`
        : `${minutesView}:${secView}`;
}

export const userAllowed = (sharedService: SharedService) => {
    const userConfig = sharedService.getUserConfig();
    if (userConfig.app_id === UserTypeEnum.PROVIDER) {
        const provider =
            userConfig.provider_list && userConfig.provider_list.length > 0
                ? userConfig.provider_list[0]
                : {};
        if (
            provider['status'] === UserRoleStatus.APPROVED &&
            provider['is_active'] === 1
        ) {
            return true;
        } else if (provider['is_active'] === 0) {
            sharedService.setSnackBar(AppMessageConstants.ACCOUNT_DISABLED);
            return false;
        } else if (provider['status'] === UserRoleStatus.REJECTED) {
            sharedService.setSnackBar(AppMessageConstants.ACCOUNT_REJECTED);
            return false;
        } else {
            sharedService.setSnackBar(AppMessageConstants.ACCOUNT_PENDING);
            return false;
        }
    } else if (userConfig.app_id === UserTypeEnum.STUDENT) {
        return true;
    } else {
        return false;
    }
};

export const getTimeSlots = () => {
    let time1 = new Date();
    time1.setHours(0);
    time1.setMinutes(0);
    let time2 = new Date();
    time2.setHours(23);
    time2.setMinutes(59);
    let arr = [];
    while (time1 < time2) {
        arr.push({
            label: fomartTimeShow(time1.getHours(), time1.getMinutes()),
            value: time1.toTimeString().substring(0, 5)
        });
        time1.setMinutes(time1.getMinutes() + 15);
    }
    return arr;
};

const fomartTimeShow = (h, m) => {
    var ampm = 'AM';
    if (h >= 12) ampm = 'PM';
    h = h % 12;
    if (h == 0) h = 12;
    if (m == 0) m = '00';
    return h + ':' + m + ' ' + ampm;
};

export const downloadDocument = (path: string, fileName: string) => {
    console.log(fileName);
    const link = document.createElement('a');
    link.setAttribute('href', path);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
