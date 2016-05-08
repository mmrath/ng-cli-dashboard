import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

import {
RestClient,
GET, DELETE, DefaultHeaders, Path, Query, Url, Produces, MediaType
} from '../../utils/rest-client';
import {Observable} from 'rxjs/Observable';
import {Order} from '../../models';

@Injectable()
@DefaultHeaders({
  'Accept': 'application/json',
  'Content-Type': 'application/json'
})
export class DataGridService extends RestClient {

  public constructor(protected http: Http) {
    super(http);
  }

  @GET('')
  @Produces(MediaType.JSON)
  public getPage(
    @Url('url') url: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: Order[]): Observable<any> {
    return null;
  };

  @GET('/{id}')
  public getById( @Path('id') id: string): Observable<any> { return null; };

  @DELETE('/{id}')
  public deleteById( @Url('url') url: string, @Path('id') id: string): Observable<any> {
    return null;
  };

}
