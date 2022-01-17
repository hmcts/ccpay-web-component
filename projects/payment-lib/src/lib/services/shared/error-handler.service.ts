import { Injectable } from '@angular/core';
import { _throw } from 'rxjs/observable/throw';
import { Observable } from 'rxjs/internal/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { stringify } from '@angular/core/src/util';

@Injectable({
  providedIn: 'root'
})


export class ErrorHandlerService {

  constructor() { }


  handleError(err: HttpErrorResponse): Observable<any> {
    let errorMessage: string;
    if (err.error instanceof Error) {
      // A client-side or network error occurred.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      if (err.status === 404) {
        if (!err.error) {
          errorMessage = 'Not found';
        } else {
          errorMessage = err.error;
        }
      }
      else if (err.status === 500) {
        errorMessage = 'Internal server error';
      } else if (err.error.messsage === undefined) {
        if( typeof err.error === 'object') {
          errorMessage =  JSON.parse(JSON.stringify(err.error)).error;
        } else {
          if (typeof err.error === 'string' && err.error !== undefined) {
            // if (JSON.parse(err.error).statusCode !== undefined && JSON.parse(err.error).statusCode === 500)
            // {
            //   errorMessage = 'Internal server error';
            // } else {
            //   errorMessage =  err.error;
            // }
            if(err.error.length > 60) {
              if (JSON.parse(err.error).statusCode !== undefined && JSON.parse(err.error).statusCode === 500)
              {
                errorMessage = 'Internal server error';
              } else {
                if(err.error.length > 60) {
                  errorMessage =  JSON.parse(err.error).error;
                } else {
                  errorMessage =  err.error;
                }
             
              }
            } else {
              errorMessage =  err.error;
            }
          } else {
            errorMessage =  JSON.parse(err.error).error;
          }
          
        }
       
      } else {
        if (err.error.message !== undefined) {
          errorMessage = `${err.error.message}`;
        } else {
          errorMessage = `${err.error}`;
        }
        
      }
    }
    return _throw(errorMessage);
  }


  getServerErrorMessage(isErrorExist) {
    return {
      title: "There is a problem with the service",
      body: "Try again later",
      showError: isErrorExist
    };
  }
}
