import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error);
  }


  // Optimized POST method
  post(url: string, data: any = {}, options: any = {}): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders(options.headers || {}),
      ...options
    };
    return this.http.post<any>(url, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Optimized GET method
  get(url: string, params: any = {}, headers: any = {}): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders(headers),
      params: new HttpParams({ fromObject: params })
    };
    return this.http.get<any>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }
}
