import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  
  transform(array: any, searchField: any): any {
    if (searchField === undefined)
        return array;
    else{
        return array.filter(function (item) {
            if (item.familyName != undefined)
                return item.familyName.toLowerCase().includes(searchField.toLowerCase());
            if (item.plantName != undefined)
              return item.plantName.toLowerCase().includes(searchField.toLowerCase());
            if (item.plantFamily != undefined)
              return item.plantFamily.toLowerCase().includes(searchField.toLowerCase());
        });
    }
  }
}
