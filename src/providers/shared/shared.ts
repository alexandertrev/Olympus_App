import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedProvider {
  private emitChangeSource = new Subject<any>();
  public changeEmitted$ = this.emitChangeSource.asObservable();

  constructor(public http: HttpClient) {
  }

  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }
}
