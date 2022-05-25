import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable()
export class WebComponentHttpClient {
  constructor(
    private http: HttpClient,
    private meta: Meta
  ) { }

  post(url: string, body: any | null, options?: any): Observable<any> {
    const opts = this.addHeaders(options || {});
    return this.http.post(url, body, opts);
  }

  put(url: string, body: any | null, options?: any): Observable<any> {
    const opts = this.addHeaders(options || {});
    return this.http.put(url, body, opts);
  }

  get(url: string, options?: any): Observable<any> {
    const opts = this.addHeaders(options || {});
    return this.http.get(url, opts);
  }

  delete(url: string, options?: any): Observable<any> {
    const opts = this.addHeaders(options || {});
    return this.http.delete(url, opts);
  }
  
  patch(url: string, body: any | null, options?: any): Observable<any> {
    const opts = this.addHeaders(options || {});
    return this.http.patch(url, body, opts);
  }

  addHeaders(options: any): any {
    const csrfToken = this.meta.getTag('name=csrf-token');
    const headers = {};
    
    if (options.headers) {
      options.headers.forEach(element => {
        headers[element] = options.headers.get(element);
      });
    }
    headers['X-Requested-With'] = 'XMLHttpRequest';
    if (csrfToken === null) {
      headers['CSRF-Token'] = document.cookie.split(';').find(row => row.startsWith(' XSRF-TOKEN')).split('=')[1];
    } else {
      headers['CSRF-Token'] = csrfToken.content;
    }
    options.headers = new HttpHeaders(headers);
    options.responseType = 'text';
    return options;
  }
}
