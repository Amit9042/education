/**
 * General function to return queryParams for grid
 */
import {isEmpty} from './common-functions';

export function queryParamsFunction(search: any, sort?: any, rowNumber?: number, recordsPerPage?: number, showAll = false) {
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
}
