import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Film } from '../entities/film';
import { UsersService } from './users.service';
import { environment } from '../environments/environment';

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {
  usersService = inject(UsersService);
  http = inject(HttpClient);
  url = environment.restServerUrl + 'films/';
  
  
  get token() {
    return this.usersService.token;
  }

  getTokenHeader(): { headers?: { [header: string]: string }, params?: HttpParams } | undefined {
    if (!this.token) {
      return undefined;
    }
    return { headers: { 'X-Auth-Token': this.token } };
  }

  getFilms(orderBy?: string, descending?: boolean, indexFrom?: number, indexTo?: number, search?: string): Observable<FilmsResponse> {
    let options = this.getTokenHeader();
    if (orderBy || descending || indexFrom || indexTo || search) {
      options = { ...(options || {}), params: new HttpParams() };
    }
    if (options && options.params) {
      if (orderBy) {
        options.params = options.params.set('orderBy', orderBy);
      }
      if (descending) {
        options.params = options.params.set('descending', descending);
      }
      if (indexFrom) {
        options.params = options.params.set('indexFrom', indexFrom);
      }
      if (indexTo) {
        options.params = options.params.set('indexTo', indexTo);
      }
      if (search) {
        options.params = options.params.set('search', search);
      }
    }
    return this.http.get<FilmsResponse>(`${this.url}`, options).pipe(
      catchError(error => this.usersService.processError(error))
    );
  }

  addFilm(film: Film): Observable<Film> {
    let options = this.getTokenHeader()
    console.log('Token:', options);
    return this.http.post<Film>(`${this.url}`, film, options).pipe(
      catchError(error => this.usersService.processError(error))
    );
  }

  updateFilm(film: Film): Observable<Film> {
    let options = this.getTokenHeader()
    console.log('Token:', options);
    console.log(this.url)
    return this.http.post<Film>(`${this.url}`, film, options).pipe(
      catchError(error => this.usersService.processError(error))
    );
  }

  getFilm(id: number): Observable<Film> {
    let options = this.getTokenHeader()
    console.log('Token:', options);
    return this.http.get<Film>(`${this.url}${id}`, options).pipe(
      catchError(error => this.usersService.processError(error))
    );
  }

  
}