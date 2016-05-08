import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ROLE_API} from '../shared/constants/api-path';
import {Role, Page} from '../shared/models';
import {Observable} from 'rxjs/Observable';
import {
  RestClient, GET, PUT, POST, BaseUrl, DefaultHeaders, Path, Body,
} from '../shared/utils/rest-client';

@Injectable()
@DefaultHeaders({
  'Accept': 'application/json',
  'Content-Type': 'application/json'
})
@BaseUrl(ROLE_API)
export class RoleService extends RestClient {

  constructor(http: Http) { super(http); }

  @GET('/{id}')
  findOne( @Path('id') id: number): Observable<Role> {
    return null;
  }

  @POST()
  save( @Body role: Role): Observable<Role> {
    return null;
  }

  @PUT('/{id}')
  update( @Path('id') id: number, @Body role: Role): Observable<Role> {
    return null;
  }

  @GET()
  findAll(): Observable<Page<Role>> {
    return null;
  }

}
