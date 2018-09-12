import * as arrify from 'arrify';
import {Service, GoogleAuthOptions} from '@google-cloud/common';
import {paginator} from '@google-cloud/paginator';
import {promisifyAll} from '@google-cloud/promisify';
import * as extend from 'extend';
import * as request from 'request';

import { CloudFunction } from './cloudfunction';

// @TODO
interface CloudFunctionMetadata {
  runtime: string;
}

// TODO
interface CloudFunctionConfig {
  runtime?: string;
  location?: string;
}

interface CloudFunctionQuery {
  autoPaginate?: true;
  maxApiCalls?: number;
  maxResults?: number;
  pageToken?: string;
  userProject?: string;
  location?: string;
}

interface Status {
  code: number;
  message: string;
  details: object[];
}

interface Operation {
  name: string;
  metadata: object;
  done: boolean;
  error: Status;
  response: object;
}

interface ListOperationsResponse {
  operations: Operation[];
  nextPageToken: string;
}

interface ApiResponse {

}

interface Credentials {
  client_email?: string;
  private_key?: string;
}

interface ConfigurationObject extends GoogleAuthOptions {
  autoRetry?: boolean;
  credentials?: Credentials;
  email?: string;
  keyFilename?: string;
  maxRetries?: number;
  projectId?: string;
  promise?: typeof Promise;
}

interface CloudFunctionCallback {
  (
    err: Error|null,
    fn?: CloudFunction|null|undefined,
    apiResponse?: request.Response
  ): void;
}

interface CloudFunctionsCallback {
  (
    err: Error|null,
    fns?: CloudFunction[]|null|undefined,
    nextQuery?: string|null|undefined,
    apiResponse?: request.Response
  ): void;
}

/*! 
 * @param {ConfigurationObject} [options] Configuration options.
 */
class GCF extends Service {
  /**
   * {@link CloudFunction} class.
   *
   * @name GCF.CloudFunction
   * @see CloudFunction
   * @type {Constructor}
   */
  static CloudFunction: typeof CloudFunction = CloudFunction;

  location: string; // GCP region

  constructor(options: ConfigurationObject = {}, location?: string) {
    const config = {
      baseUrl: 'https://cloudfunctions.googleapis.com/v1',
      projectIdRequired: false,
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/cloudfunctions'
      ],
      packageJson: require('../../package.json'),
      requestModule: request,
    };

    super(config, options);

    this.location = location || 'us-central1';

  }

  /**
   * Get a reference to a Cloud Functions function.
   *
   * @param {string} name Name of the function.
   * @returns {CloudFunction}
   */
  public cloudFunction(name: string): CloudFunction {
    if (!name) {
      throw new Error('A function name is needed to use Cloud Functions.');
    }
    return new CloudFunction(this, name);
  }

  // @developer @archelogos
  // not tested yet
  /**
   * Create a function.
   *
   * @param {string} name Name of the function to create.
   * @param {CloudFunctionConfig} [metadata] Metadata to set for the function.
   * @param {CloudFunctionCallback} [callback]
   * @returns {Promise<CloudFunction>}
   * @throws {Error} If a name is not provided.
   *
   */
  public createCloudFunction(name: string, callback: CloudFunctionCallback): void;
  public createCloudFunction(
      name: string, metadata: CloudFunctionConfig,
      callback: CloudFunctionCallback): void;
  public createCloudFunction(
  name: string, metadataOrCallback: CloudFunctionCallback|CloudFunctionConfig,
  callback?: CloudFunctionCallback): void {

    if (!name) {
      throw new Error('A name is required to create a function.');
    }

    let metadata: CloudFunctionConfig;
    if (!callback) {
      callback = metadataOrCallback as CloudFunctionCallback;
      metadata = {};
    } else {
      metadata = metadataOrCallback as CloudFunctionConfig;
    }

    // @developer @archelogos
    // & in a type position means type intersection.
    // https://www.typescriptlang.org/docs/handbook/advanced-types.html#intersection-types
    const body: CloudFunctionConfig&
     {name?: string, runtime?: string} = extend({}, metadata, {name});

    // @developer @archelogos
    // @TODO business logic here
    // is there a way to get this dynamically?
    const functionRuntimes = {
      node6: 'nodejs6',
      node8: 'nodejs8',
      python3: 'python3'
    };

    const location = metadata.location || this.location; // GCP region

    this.request(
        {
          method: 'POST',
          uri: `/projects/${this.projectId}/locations/${location}/functions`,
          qs: '',
          json: body,
        },
        (err, resp) => {
          if (err) {
            callback!(err, null, resp);
            return;
          }

          // @developer @archelogos
          // @TODO wait until the operations is resolved --> return CloudFunction instance
          const cloudFunction = this.cloudFunction(name);
          // check this
          // cloudFunction.metadata = resp;

          // @developer @archelogos
          // That's the non-null assertion operator (https://stackoverflow.com/questions/42273853/in-typescript-what-is-the-exclamation-mark-bang-operator-when-dereferenci)
          callback!(null, cloudFunction, resp);
        });
  }

  // @TODO @archelogos
  private getLocations(){

  }

  /**
   * Get Function objects for all of the functions in your project.
   *
   * @param {CloudFunctionQuery} [query] Query object for listing function.
   * @param {CloudFunctionCallback} [callback] Callback function.
   * @returns {Promise<CloudFunction[]>}
   */
  public getFunctions(query: CloudFunctionQuery = {}, callback?: CloudFunctionsCallback): void {

    const location = query.location || this.location; // GCP region

    // @developer @archelogos
    // @TODO check if parent is valid (this.getLocations)

    this.request(
        {
          method: 'GET',
          uri: `/projects/${this.projectId}/locations/${location}/functions`,
          qs: ''
        },
        (err, resp) => {
          if (err) {
            callback!(err, null, null, resp);
            return;
          }

          const cloudFunctions = arrify(resp.functions).map(fn => {
            const cloudFunctionInstance = this.cloudFunction(fn.name);
            cloudFunctionInstance.metadata = {runtime: fn.runtime};
            return cloudFunctionInstance;
          });

          let nextQuery;
          if (resp.nextPageToken) {
            nextQuery = extend({}, query, {pageToken: resp.nextPageToken});
          }

          callback!(null, cloudFunctions, nextQuery, resp);
        });
  }

}

/*! Developer Documentation
 *
 * These methods can be auto-paginated.
 */
paginator.extend(GCF, 'getFunctions');

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(GCF, {
  exclude: ['cloudFunction'],
});

/**
 */
export { GCF };
