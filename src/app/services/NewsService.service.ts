import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NewsModel }        from '../models/news.model'
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = `${environment.apiBaseUrl}News/topstories`;

  constructor(private httpClient: HttpClient) {}

  getNews(pageNumber:number,pageSize:number): Observable<NewsModel> {
    return this.httpClient.get<NewsModel>(`${this.apiUrl}?page=${pageNumber}&pagesize=${pageSize}`).pipe(
      catchError((error) => {
        console.error('Error fetching news:', error);
        return throwError(() => new Error('Failed to load news'));
      })
    );;
  }
}
