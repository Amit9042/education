import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  private hours: number = 0;
  private minutes: number = 0;
  private seconds: number = 0;

  /* in this method,
    if developer is passing suffixUnit then two ':' should be there in suffixUnit.
    otherwise always blank('') string will return as output 
    
    For Example:
    '11 HOUR 12 MINUTE 13 SECOND' =  suffixUnit's value should be 'HOUR:MINUTE:SECOND'
    '11 HOUR 12 MINUTE' =  suffixUnit's value should be 'HOUR:MINUTE:'
    '12 MINUTE' =  suffixUnit's value should be ':MINUTE:'
    '12 HOUR' =  suffixUnit's value should be 'HOUR::'

    also Order of suffixUnit is important.
  */
  transform(value: number = 0, pattern?: string, suffixUnit: string = SuffixUnit.HR_MIN_SEC): any {
    const duration = this.calculateDuration(value, pattern);
    const charArray = suffixUnit.split(':');
    let string = '';
    if (charArray.length === 3) {
      if (charArray[0]) {
        string += duration.hours + ' ' + charArray[0];
      }
      if (charArray[1]) {
        string += ' ' + duration.minutes + ' ' + charArray[1];
      }
      if (charArray[2]) {
        string += ' ' + duration.seconds + ' ' + charArray[2];
      }
    }
    return string;
  }

  private calculateDuration(seconds: number, pattern: string) {
    if (pattern.includes(DurationFormatEnum.HH) && pattern.includes(DurationFormatEnum.MM)) {
      this.hours = Math.floor(seconds / 3600);
      this.minutes = Math.floor((seconds % 3600) / 60);
    } else if (pattern.includes(DurationFormatEnum.HH)) {
      this.hours = Math.floor(seconds / 3600);
    } else if (pattern.includes(DurationFormatEnum.MM)) {
      this.minutes = Math.floor(seconds / 60);
    }
    this.seconds = Math.floor((seconds % 3600) % 60);
    return { hours: this.hours, minutes: this.minutes, seconds: this.seconds };
  }
}

export const DurationFormatEnum = {
  HH_MM_SS: 'hh:mm:ss',
  HH_MM: 'hh:mm',
  MM_SS: 'mm:ss',
  HH: 'hh',
  MM: 'mm',
}

export const SuffixUnit = {
  HR_MIN_SEC: 'hr:min:sec',
  HR_M: 'hr:m:',
  MIN_SEC: ':min:sec',
  MINUTE: ':minute:',
  HOUR: 'hour::',
  MIN: ':min:'
}

/* TESTED  */
/*<label>{{36700 | duration : durationPattern.HH_MM : suffixUnit.HR_M}}</label>
<label>{{36700 | duration : durationPattern.MM_SS : suffixUnit.MIN_SEC}}</label>
<label>{{36700 | duration : durationPattern.HH_MM_SS : suffixUnit.HR_MIN_SEC}}</label>
<label>{{36700 | duration : durationPattern.HH : suffixUnit.HOUR}}</label>
<label>{{36700 | duration : durationPattern.MM : suffixUnit.MINUTE}}</label>
                        */

