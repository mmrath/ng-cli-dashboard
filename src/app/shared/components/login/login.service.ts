import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {LOGIN_API} from '../../constants/api-path';
import {Observable} from 'rxjs/Observable';
import {RestClient, POST, BaseUrl, DefaultHeaders, Body } from '../../utils/rest-client';


@Injectable()
@DefaultHeaders({
  'Accept': 'application/json',
  'Content-Type': 'application/json'
})
@BaseUrl(LOGIN_API)
export class LoginService extends RestClient {

  constructor(http: Http) { super(http); }

  @POST()
  login( @Body loginDto: any): Observable<any> {
    return undefined;
  }

}
