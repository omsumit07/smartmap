import { Injectable, RootRenderer } from '@angular/core';
import { Observable, of ,BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class NumberObserverService{
    private isChange: BehaviorSubject<Number>

    constructor(){
        this.isChange = new BehaviorSubject<Number>(0);
    }
    public checkNumber(value) : Observable<Number>{
        return this.isChange.asObservable();
    }
}