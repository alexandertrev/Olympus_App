import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class PlantsProvider {

  constructor(public http: HttpClient,
              private api: ApiProvider) {
    
  }

  addPlant(plant){
    let response = this.api.post('plants/add', plant).share();
    return response;
  }
  
  getPlants(){
    let response = this.api.get('plants/get').share();
    return response;
  }

  getPlantsByFamily(familyName){
    let dataToServer = {
      familyName: familyName
    }
    let response = this.api.post('plants/getPlantsByFamily', dataToServer).share();
    return response;
  }
}
