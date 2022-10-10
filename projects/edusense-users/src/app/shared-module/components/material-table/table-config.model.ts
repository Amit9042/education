export interface TableConfigModel {
    name: string;
    addRecordLabel: string;
    columns: TableColumnModel[];
}

export interface TableColumnModel {
    columnName: string;
    displayName: string;
    width: string;
    sort: boolean;
    filter: TableFilter;
    keyName: string | string[];
    dateFormat?: string;
    metadata?: any;
    type: string;
    image?: ImageModel;
}

export interface ImageModel {
    keyPath: string;
    placeholder?: string;
    baseUrl?: string;
}

export interface TableFilter {
    id: string;
    type: string;
    placeholder: string;
    controlName: string;
    options: any[];
    defaultValue: string | number;
    maxDate?: Date;
    operator?: string;
    class?: ClassModel;
}

export interface ClassModel {
    [key: string]: boolean;
}
