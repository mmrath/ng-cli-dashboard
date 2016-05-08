/*
Copied from https://github.com/Paldom/@angular-rest and the following modified/added
* Changed name from RESTClient to RestClient
* Changed URL for method decoration (GET, PUT, POST, DELETE, HEAD) is optional
* New decorator Url added to parameters, this will replace the BaseUrl
* JSON response is default, for non JSON use @Produces(MediaType.RAW)

@angular-rest (c) Domonkos Pal
License: MIT
*/

import {Inject} from '@angular/core';
import {
  Http, Headers as AngularHeaders,
  Request, RequestOptions, RequestMethod as RequestMethods,
  Response,
  URLSearchParams
} from '@angular/http';
import {Observable} from 'rxjs/Observable';

/*
* Angular 2 RestClient class.
*
* @class RestClient
* @constructor
*/
export class RestClient {

  public constructor( @Inject(Http) protected http: Http) {
  }

  protected getBaseUrl(): string {
    return null;
  };

  protected getDefaultHeaders(): Object {
    return null;
  };

  /**
   * Request Interceptor
   *
   * @method requestInterceptor
   * @param {Request} req - request object
   */
  protected requestInterceptor(req: Request) {
    //
  }

  /**
   * Response Interceptor
   *
   * @method responseInterceptor
   * @param {Response} res - response object
   * @returns {Response} res - transformed response object
   */
  protected responseInterceptor(res: Observable<any>): Observable<any> {
    return res;
  }

}

/**
 * Set the base URL of REST resource
 * @param {String} url - base URL
 */
export function BaseUrl(url: string) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {
    Target.prototype.getBaseUrl = function () {
      return url;
    };
    return Target;
  };
}

/**
 * Set default headers for every method of the RestClient
 * @param {Object} headers - deafult headers in a key-value pair
 */
export function DefaultHeaders(headers: any) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {
    Target.prototype.getDefaultHeaders = function () {
      return headers;
    };
    return Target;
  };
}

function paramBuilder(paramName: string) {
  return function (key: string) {
    return function (target: RestClient, propertyKey: string | symbol, parameterIndex: number) {
      let metadataKey = `${propertyKey}_${paramName}_parameters`;
      let paramObj: any = {
        key: key,
        parameterIndex: parameterIndex
      };
      if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(paramObj);
      } else {
        target[metadataKey] = [paramObj];
      }
    };
  };
}

/**
 * Url for the request, type: string.
 * This will override the value of BaseUrl
 * @param {string} url - url path to bind value
 */
export const Url = paramBuilder('Url');

/**
 * Path variable of a method's url, type: string
 * @param {string} key - path key to bind value
 */
export var Path = paramBuilder('Path');
/**
 * Query value of a method's url, type: string
 * @param {string} key - query key to bind value
 */
export var Query = paramBuilder('Query');
/**
 * Body of a REST method, type: key-value pair object
 * Only one body per method!
 */
export var Body = paramBuilder('Body')('Body');
/**
 * Custom header of a REST method, type: string
 * @param {string} key - header key to bind value
 */
export var Header = paramBuilder('Header');


/**
 * Set custom headers for a REST method
 * @param {Object} headersDef - custom headers in a key-value pair
 */
export function Headers(headersDef: any) {
  return function (target: RestClient, propertyKey: string, descriptor: any) {
    descriptor.headers = headersDef;
    return descriptor;
  };
}


/**
 * Defines the media type(s) that the methods can produce
 * @param MediaType producesDef - mediaType to be parsed
 */
export function Produces(producesDef: MediaType) {
  return function (target: RestClient, propertyKey: string, descriptor: any) {
    descriptor.mediaType = producesDef;
    return descriptor;
  };
}


/**
 * Supported @Produces media types
 */
export enum MediaType {
  JSON,
  RAW // No transalation
}


function methodBuilder(method: number) {
  return function (url?: string) {
    return function (target: RestClient, propertyKey: string, descriptor: any) {

      let pUrl = target[`${propertyKey}_Url_parameters`];
      let pPath = target[`${propertyKey}_Path_parameters`];
      let pQuery = target[`${propertyKey}_Query_parameters`];
      let pBody = target[`${propertyKey}_Body_parameters`];
      let pHeader = target[`${propertyKey}_Header_parameters`];

      descriptor.value = function (...args: any[]) {


        // Body
        let body = null;
        if (pBody) {
          body = JSON.stringify(args[pBody[0].parameterIndex]);
        }

        // Path
        let resUrl = '';
        if (typeof url === 'string') {
          resUrl = url;
        }
        if (pPath) {
          for (var k in pPath) {
            if (pPath.hasOwnProperty(k)) {
              resUrl = resUrl.replace('{' + pPath[k].key + '}', args[pPath[k].parameterIndex]);
            }
          }
        }

        // Query
        let search = new URLSearchParams();
        if (pQuery) {
          pQuery
            .filter(p => args[p.parameterIndex]) // filter out optional parameters
            .forEach(p => {
              let key = p.key;
              let value = args[p.parameterIndex];
              if (Array.isArray(value)) {
                let valueArr = value as Array<any>;
                valueArr.forEach(obj => {
                  let arrParamValue = obj;
                  if (obj instanceof Object) {
                    arrParamValue = JSON.stringify(obj);
                  }
                  search.append(encodeURIComponent(key), encodeURIComponent(arrParamValue));
                });
              } else if (value instanceof Object) { // if the value is a instance of Object, we stringify it
                value = JSON.stringify(value);
                search.set(encodeURIComponent(key), encodeURIComponent(value));
              } else {
                search.set(encodeURIComponent(key), encodeURIComponent(value));
              }
            });
        }

        // Headers
        // set class default headers
        let headers = new AngularHeaders(this.getDefaultHeaders());
        // set method specific headers
        for (let k in descriptor.headers) {
          if (descriptor.headers.hasOwnProperty(k)) {
            headers.append(k, descriptor.headers[k]);
          }
        }
        // set parameter specific headers
        if (pHeader) {
          for (let k in pHeader) {
            if (pHeader.hasOwnProperty(k)) {
              headers.append(pHeader[k].key, args[pHeader[k].parameterIndex]);
            }
          }
        }

        let overrideUrl = null;
        if (pUrl) {
          overrideUrl = args[pUrl[0].parameterIndex] + resUrl;
        } else {
          overrideUrl = this.getBaseUrl() + resUrl;
        }
        // Request options
        let options = new RequestOptions({
          method,
          url: overrideUrl,
          headers,
          body,
          search
        });

        let req = new Request(options);

        // intercept the request
        this.requestInterceptor(req);
        // make the request and store the observable for later transformation
        let observable: Observable<Response> = this.http.request(req);

        // transform the obserable in accordance to the @Produces decorator
        if (typeof descriptor.mediaType === 'undefined'
          || descriptor.mediaType === MediaType.JSON) {
          observable = observable.map(res => res.json());
        }

        // intercept the response
        observable = this.responseInterceptor(observable);

        return observable;
      };

      return descriptor;
    };
  };
}

/**
 * GET method
 * @param {string} url - resource url of the method
 */
export var GET = methodBuilder(RequestMethods.Get);
/**
 * POST method
 * @param {string} url - resource url of the method
 */
export var POST = methodBuilder(RequestMethods.Post);
/**
 * PUT method
 * @param {string} url - resource url of the method
 */
export var PUT = methodBuilder(RequestMethods.Put);
/**
 * DELETE method
 * @param {string} url - resource url of the method
 */
export var DELETE = methodBuilder(RequestMethods.Delete);
/**
 * HEAD method
 * @param {string} url - resource url of the method
 */
export var HEAD = methodBuilder(RequestMethods.Head);
