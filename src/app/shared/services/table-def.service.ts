import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {
  RestClient, GET, POST, PUT, BaseUrl, DefaultHeaders, Body, Path, Query
} from '../../shared/utils/rest-client';
import {TableDef} from '../../shared/models';

@Injectable()
@DefaultHeaders({
  'Accept': 'application/json',
  'Content-Type': 'application/json'
})
@BaseUrl('/api/table')
export class TableDefService extends RestClient {

  constructor(protected http: Http) {
    super(http);
  }

  @GET('/search/table-name')
  getByTableName( @Query('tableName') name: string): Observable<TableDef> {
    return null;
  };

  @GET('/search/code-name')
  findByCodeName( @Query('codeName') codeName: string): Observable<TableDef> {
    return null;
  }

  @GET('/{id}')
  findById( @Path('id') id: number): Observable<TableDef> {
    return null;
  }

  @POST()
  save( @Body tableDef: TableDef): Observable<TableDef> {
    return null;
  }

  @PUT('/{id}')
  update( @Path('id') id: number, @Body tableDef: TableDef): Observable<TableDef> {
    return null;
  }
}
