import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, debounce, distinctUntilChanged, of, Subject, switchMap, timer} from 'rxjs';
import {SearchQuery} from './new-conversation/model/user.model';
import {State} from '../../shared/model/state.model';
import {BaseUser} from '../../shared/model/user.model';
import {createPaginationOption} from "../../shared/model/request.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserSearchService {

  httpClient = inject(HttpClient);

  private searchQuery$ = new Subject<SearchQuery>();
  private searchResult$ = new Subject<State<Array<BaseUser>>>();
  searchResult = this.searchResult$.asObservable();

  constructor() {
    this.listenToSearch();
  }

  private fetchResult(searchQuery: SearchQuery) {
    let params = createPaginationOption(searchQuery.page);
    params = params.set("query", searchQuery.query);
    return this.httpClient.get<Array<BaseUser>>(`${environment.API_URL}/users/search`, {params});
  }

  private listenToSearch() {
    this.searchQuery$.pipe(
        distinctUntilChanged(),
        debounce(() => timer(300)),
        switchMap(query => this.fetchResult(query).pipe(
            catchError(err => {
              this.searchResult$.next(State.Builder<Array<BaseUser>>().forError(err))
              return of([]);
            })
            )
        )
    ).subscribe({
        next: users => this.searchResult$.next(State.Builder<Array<BaseUser>>().forSuccess(users)),
        error: err => this.searchResult$.next(State.Builder<Array<BaseUser>>().forError(err))
    });
  }

  search(searchQuery: SearchQuery) {
    this.searchQuery$.next(searchQuery);
  }
}
