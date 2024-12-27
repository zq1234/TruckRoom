import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TruckService} from'../interfaces/TruckServiceModel';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  apiUrl = 'https://localhost:7250';
  http = inject(HttpClient);
  constructor() {}

  getAllTruckService() {
    console.log('getAllService', localStorage.getItem('token'));
    return this.http.get<TruckService[]>(this.apiUrl + '/api/Service/getall');
  }
  createTruckService(truckService: TruckService) {
    return this.http.post(this.apiUrl + '/api/Service/create', truckService);
  }
  getTruckService(truckServiceId: number) {
    return this.http.get<TruckService>(
      this.apiUrl + '/api/Service/' + truckServiceId
    );
  }
  updateTruckService(truckServiceId: number, truckService: TruckService) {
    return this.http.put<TruckService>(
      this.apiUrl + '/api/Service/' + truckServiceId,
      truckService
    );
  }
  deleteTruckService(truckServiceId: number) {
    return this.http.delete(this.apiUrl + '/api/Service/' + truckServiceId);
  }
  login(username: string, password: string) {
    return this.http.post<{ token: string }>(this.apiUrl + '/api/Account/login', {
      username: username,
      password: password,
    });
  }
}
