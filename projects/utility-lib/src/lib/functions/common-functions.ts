import * as FileSaver from 'file-saver';
import * as _moment from 'moment';
import { SharedService } from '../services/shared.service';
import { StatusTypeEnum, UserRoleStatus, UserTypeEnum } from '../constants';

const moment = _moment;

export const appLogger = (message?: any, ...optionalParams: any[]) => {
    // if (
    //     environment.envType === EnvironmentEnum.LOCAL ||
    //     environment.envType === EnvironmentEnum.DEV
    // ) {
    //     console.log(message, ...optionalParams);
    // }
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

export const hours24TimeConvert = time => {
    // Check correct time format and split into components
    time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' am' : ' pm'; // Set AM/PM
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

export const trunkTrailString_1 = (
    str: string,
    displayLength: number,
    isViewMore: boolean
) => {
    if (isViewMore) {
        return str;
    }
    return (
        str &&
        (str.length > displayLength
            ? `${str.substr(0, displayLength)}...`
            : str)
    );
};
