import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'keyValue'
})
export class keyValuePipe implements PipeTransform {
  constructor() {}
  transform(input: any): any {
    let keys = [];
    for (let key in input) {
      if (input.hasOwnProperty(key)) {
        keys.push({ key: key, value: input[key]});
      }
    }
    return keys;
  }
}
