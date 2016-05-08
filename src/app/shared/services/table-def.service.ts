import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {
  RestClient, GET, POST, BaseUrl, DefaultHeaders, Body, Query
} from '../../shared/utils/rest-client';
import {Observable} from 'rxjs/Observable';
import {TableDef} from '../../shared/models';

@Injectable()
@DefaultHeaders({
  'Accept': 'application/json',
  'Content-Type': 'application/json'
})
@BaseUrl('/api/table')
export class TableDefService extends RestClient {

  public constructor(protected http: Http) {
    super(http);
  }

  @GET('/search/table-name')
  public getByTableName( @Query('tableName') name: string): Observable<TableDef> {
    return null;
  };

  @GET('/search/code-name')
  public findByCodeName( @Query('codeName') codeName: string): Observable<TableDef> {
    return null;
  };

  @POST()
  public save( @Body tableDef: TableDef): Observable<TableDef> {
    return null;
  }


}
