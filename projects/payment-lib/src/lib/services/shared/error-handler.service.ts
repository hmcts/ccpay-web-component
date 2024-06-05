import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ErrorHandlerService {

  constructor() { }

handleError(err: HttpErrorResponse): Observable<any> {
  let errorMessage: string;

  // Check if the error is client-side or network error
  if (err.error instanceof ErrorEvent) {
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    // Check if the error is from the server-side
    if (err.status === 400 || err.status === 404) {
      try {
        // Attempt to parse error as JSON
        const parsedError = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;

        if (parsedError.statusCode && parsedError.statusCode === 500) {
          errorMessage = 'Internal server error';
        } else if (parsedError.message) {
            if(parsedError.error !=undefined && parsedError.statusCode === 400){
                errorMessage = parsedError.error;
            }else{
              errorMessage = parsedError.message;
            }
        } else if (parsedError.error) {
          errorMessage = parsedError.error;
        } else {
          errorMessage = err.error;
        }
      } catch (e) {
        // Fallback if parsing fails
        errorMessage = err.error;
      }
    } else if (err.status === 500) {
      errorMessage = 'Internal server error';
    } else {
      // General fallback for other status codes
      errorMessage = err.error.message || err.error;
    }
  }
  return throwError(errorMessage);
}





  getServerErrorMessage(isErrorExist, isDataNotExist = false, error='') {
    const bodyContent = isDataNotExist ? error : 'Try again later';
    return {
      title: "There is a problem with the service",
      body: bodyContent,
      showError: isErrorExist
    };
  }
}
