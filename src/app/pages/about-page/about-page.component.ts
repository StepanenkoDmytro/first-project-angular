import { Component, OnInit } from '@angular/core';
import { EMPTY, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap, catchError, filter } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';


export const url: string = 'https://api.github.com/search/users?q=';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {

  public stream$: any;
  public users: any[] = [];

  ngOnInit(): void {

    const search: HTMLElement | null = document.getElementById('search');

    if (search) {
      this.stream$ = fromEvent<InputEvent>(search, 'input')
      .pipe(
        map((e: InputEvent) => (e.target as HTMLInputElement).value),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.users = []),
        filter((v: string) => v.trim().length > 0),
        switchMap(v => ajax.getJSON(url + v).pipe(
          catchError(err => EMPTY)
        )),
        map((response: any) => response.items),
        mergeMap(items => items)
      );
    }

    this.stream$.subscribe((val: any) => {
      this.users.push(val);
      console.log(val);
    })
  }
}
