import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'checkEmpty'})
export class CheckEmptyPipe implements PipeTransform {

    transform(value: any): string {
        if (value === '' || value === null || value === undefined) {
            return '-';
        } else {
            return value;
        }
    }
}

@Pipe({name: 'placeNA'})
export class PlaceNAPipe implements PipeTransform {

    transform(value: any): string {
        if (value === '' || value === null || value === undefined) {
            return 'N/A';
        } else {
            return value;
        }
    }
}
