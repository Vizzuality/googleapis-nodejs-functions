import * as arrify from 'arrify';
import {Service, GoogleAuthOptions} from '@google-cloud/common';
import {paginator} from '@google-cloud/paginator';
import {promisifyAll} from '@google-cloud/promisify';
import * as extend from 'extend';
import * as request from 'request';

import { CloudFunction } from './cloudfunction';

export enum CloudFunctionStatus {
  CLOUD_FUNCTION_STATUS_UNSPECIFIED,
  ACTIVE,
  OFFLINE,
  DEPLOY_IN_PROGRESS,
  DELETE_IN_PROGRESS,
  UNKNOWN,
}

export enum CloudFunctionRuntimes {
  nodejs6,
  nodejs8,
  python3,
}

export interface HttpsTrigger {
  url: string;
}

export interface FailurePolicy {
  retry: any;
}

// @developer -> https://cloud.google.com/functions/docs/reference/rest/v1/projects.locations.functions#EventTrigger
export interface EventTrigger {
  eventType: string;
  resource: string;
  service: string;
  failurePolicy?: FailurePolicy;
}

// @developer -> https://cloud.google.com/functions/docs/reference/rest/v1/projects.locations.functions#SourceRepository
export interface SourceRepository {
  url: string;
  deployedUrl?: string;
}

// @TODO -> DONE v0.0.3
export interface CloudFunctionMetadata {
  runtime: string;
  description: string;
  status: CloudFunctionStatus;
  entryPoint: string;
  timeout: string;
  availableMemoryMb: number;
  serviceAccountEmail: string;
  updateTime: string;
  versionId: string;
  labels: any;
  environmentVariables: any;
  network: string;
  maxInstances: number;
  sourceArchiveUrl?: string;
  sourceRepository?: SourceRepository;
  sourceUploadUrl?: string;
  httpsTrigger?: HttpsTrigger;
  eventTrigger?: EventTrigger; 
}

// @TODO -> DONE v0.0.3
export interface CloudFunctionConfig {
  location?: string;
  runtime?: string;
  description?: string;
  entryPoint?: string;
  timeout?: string;
  availableMemoryMb?: number;
  labels?: any;
  //environmentVariables?: any; // beta feature
  //network?: string; // alpha feature
  //maxInstances: number; // alpha feature
  sourceArchiveUrl?: string;
  sourceRepository?: SourceRepository;
  sourceUploadUrl?: string;
  httpsTrigger?: HttpsTrigger;
  eventTrigger?: EventTrigger; 
}

export interface CloudFunctionQuery {
  autoPaginate?: true;
  maxApiCalls?: number;
  maxResults?: number;
  pageToken?: string;
  userProject?: string;
  location?: string;
}

export interface Status {
  code: number;
  message: string;
  details?: any;
}

export interface Operation {
  name: string;
  metadata: any;
  done: boolean;
  error?: Status;
  response?: any;
}

export interface ListOperationsResponse {
  operations: Operation[];
  nextPageToken: string;
}

export interface ApiResponse {

}

export interface Credentials {
  client_email?: string;
  private_key?: string;
}

export interface ConfigurationObject extends GoogleAuthOptions {
  autoRetry?: boolean;
  credentials?: Credentials;
  email?: string;
  keyFilename?: string;
  maxRetries?: number;
  projectId?: string;
  promise?: typeof Promise;
}

export interface CloudFunctionCallback {
  (
    err: Error|null,
    fn?: CloudFunction|null|undefined|Operation,
    apiResponse?: request.Response
  ): void;
}

export interface CloudFunctionsCallback {
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
  public cloudFunction(name: string, metadata?: CloudFunctionMetadata): CloudFunction {
    if (!name) {
      throw new Error('A function name is needed to use Cloud Functions.');
    }
    return new CloudFunction(this, name, metadata);
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
  public createCloudFunction(name: string,  callback: CloudFunctionCallback): void | Promise<[Operation, any]>;
  public createCloudFunction(
      name: string, metadata: CloudFunctionConfig,
      callback?: CloudFunctionCallback): void | Promise<[Operation, any]>;
  public createCloudFunction(
  name: string, metadataOrCallback: CloudFunctionCallback|CloudFunctionConfig,
  callback?: CloudFunctionCallback): void | Promise<[Operation, any]> {

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
    {name: string, runtime?: string} = extend({}, metadata, {name});

    // @developer @archelogos
    // @TODO business logic here -> runtimes check

    const location = metadata.location || this.location; // GCP region

    // @developer @archelogos
    // @TODO business logic here -> name check
    body.name = `projects/${this.projectId}/locations/${location}/functions/${name}`

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

          const operation: Operation = resp;

          // @developer @archelogos
          // That's the non-null assertion operator (https://stackoverflow.com/questions/42273853/in-typescript-what-is-the-exclamation-mark-bang-operator-when-dereferenci)
          callback!(null, operation, resp);
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
  public getCloudFunctions(query: CloudFunctionQuery = {}, callback?: CloudFunctionsCallback): void | Promise<[CloudFunction[], any]> {

    const location = query.location || this.location; // GCP region

    // @developer @archelogos
    // @TODO check if parent is valid (this.getLocations)
    // -> https://cloud.google.com/functions/docs/reference/rest/v1/projects.locations/list

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
            const cloudFunctionInstance = this.cloudFunction(fn.name, (fn as CloudFunctionMetadata));
            return cloudFunctionInstance;
          });

          let nextQuery;
          if (resp.nextPageToken) {
            nextQuery = extend({}, query, {pageToken: resp.nextPageToken});
          }

          callback!(null, cloudFunctions, nextQuery, resp);
        });
  }

  public operation(name: string, callback?: CloudFunctionCallback): void | Promise<[Operation, any]> {

    // @TODO validate name /operations/some/unique/name
    this.request(
      {
        method: 'GET',
        uri: `/${name}`,
        qs: ''
      },
      (err, resp) => {
        if (err) {
          callback!(err, null, resp);
          return;
        }

        const operation: Operation = resp;
  
        // @developer @archelogos
        // That's the non-null assertion operator (https://stackoverflow.com/questions/42273853/in-typescript-what-is-the-exclamation-mark-bang-operator-when-dereferenci)
        callback!(null, operation, resp);
      });

  }

}

/*! Developer Documentation
 *
 * These methods can be auto-paginated.
 */
paginator.extend(GCF, 'getCloudFunctions');

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(GCF, {
  exclude: ['cloudFunction'],
});

export {GCF, CloudFunction};
