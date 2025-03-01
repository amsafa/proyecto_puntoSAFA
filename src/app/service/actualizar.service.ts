import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActualizarService {

  constructor() { }
  private refreshHeaderSubject = new Subject<void>();

  get refreshHeader$() {
    return this.refreshHeaderSubject.asObservable();
  }

  triggerRefreshHeader() {
    this.refreshHeaderSubject.next();
  }
}

export class ActualizarHeaderService {
}
