import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {PERMISSION_API} from '../../shared/constants/api-path';
import {Permission, Resource} from '../../shared/models';
import {Observable} from 'rxjs/Observable';
import {
  RestClient, GET, BaseUrl, DefaultHeaders
} from '../../shared/utils/rest-client';

@Injectable()
@DefaultHeaders({
  'Accept': 'application/json',
  'Content-Type': 'application/json'
})
@BaseUrl(PERMISSION_API)
export class PermissionService extends RestClient {
  constructor(http: Http) { super(http); }

  @GET()
  findAllPermissions(): Observable<Array<Permission>> {
    return null;
  }

  @GET('/accessLevels')
  findAllAccessLevels(): Observable<Array<string>> {
    return null;
  }

  @GET('/resources')
  findAllResources(): Observable<Array<Resource>> {
    return null;
  }

  @GET('/groups')
  findAllPermissionGroups(): Observable<Map<number, Map<string, Permission>>> {
    return null;
  }

}
