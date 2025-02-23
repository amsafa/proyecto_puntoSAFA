import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfiladmService {

  // URL correcta según tu backend
  private apiUrl = `${environment.apiUrl}`;
  private http: any;

}




