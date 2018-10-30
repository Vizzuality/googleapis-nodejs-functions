import {ServiceObject, util} from '@google-cloud/common';
import {promisifyAll} from '@google-cloud/promisify';
import * as is from 'is';
import * as request from 'request';

import { GCF, CloudFunctionMetadata } from '.';

/**
 * Create a Function object to interact with a Cloud Functions.
 *
 * @param {GCF} gcf {@link GCF} instance.
 * @param {string} name The name of the function.
 * @param {object} [options] Configuration object.
 * @param {string} [options.userProject] User project.
 */
export class CloudFunction extends ServiceObject {
  /**
   * The function's name.
   * @name CloudFunction#name
   * @type {string}
   */
  name: string;

  metadata: CloudFunctionMetadata;

  /**
   * A reference to the {@link GCF} associated with this {@link CloudFunction}
   * instance.
   * @name CloudFunction#gcf
   * @type {GCF}
   */
  gcf: GCF;

  /**
   * A user project to apply to each request from this function.
   * @name CloudFunction#userProject
   * @type {string}
   */
  userProject: string;

  constructor(gcf, name, metadata?, options?) {
    options = options || {};

    const methods = {
      create: true,
      delete: true,
      exists: true,
      get: true,
      getMetadata: true
    };

    super({
      parent: gcf,
      baseUrl: `projects/${gcf.projectId}/locations/${gcf.location}/functions`, // @TODO
      id: name,
      createMethod: gcf.createCloudFunction.bind(gcf),
      methods,
      requestModule: request,
    });

    this.gcf = gcf;
    this.name = name;
    this.metadata = metadata;
    this.userProject = options.userProject;
  }

  /**
   * Delete the function.
   *
   * @param {object} [options] Configuration options.
   * @param {string} [options.userProject] The ID of the project which will be
   *     billed for the request.
   * @param {FunctionCallback} [callback] Callback function.
   * @returns {Promise<Operation>}
   */
  delete(options?, callback?) {
    if (is.fn(options)) {
      callback = options;
      options = {};
    }

    this.request(
      {
        method: 'DELETE',
        uri: '',
        qs: options,
      }, (err, resp) => {
        if (err) {
          callback!(err, resp);
          console.log(err);
          return;
        }
        console.log(resp);
        callback!(null, resp) || util.noop
      });
  }

  /**
   * Check if the function exists.
   *
   * @param {object} [options] Configuration options.
   * @param {string} [options.userProject] The ID of the project which will be
   *     billed for the request.
   * @param {FunctionCallback} [callback] Callback function.
   * @returns {Promise<boolean>}
   *
   */
  exists(options?, callback?) {
    if (is.fn(options)) {
      callback = options;
      options = {};
    }

    options = options || {};

    this.get(options, err => {
      if (err) {
        if (err.code === 404) {
          callback(null, false);
        } else {
          callback(err);
        }

        return;
      }

      callback(null, true);
    });
  }

  /**
   * Get a Function if it exists.
   *
   * @param {object} [options] Configuration options.
   * @param {string} [options.userProject] The ID of the project which will be
   *     billed for the request.
   * @param {CloudFunctionCallback} [callback] Callback function.
   * @returns {Promise<CloudFunction>}
   *
   */
  get(options, callback?) {
    if (is.fn(options)) {
      callback = options;
      options = {};
    }

    options = options || {};

    const onCreate = (err, fn, apiResponse) => {
      if (err) {
        if (err.code === 409) {
          this.get(options, callback);
          return;
        }

        callback(err, null, apiResponse);
        return;
      }

      callback(null, fn, apiResponse);
    };

    this.getMetadata(options, (err, metadata) => {
      if (err) {
        if (err.code === 404) {
          const args = [] as object[];

          if (!is.empty(options)) {
            args.push(options);
          }

          args.push(onCreate);

          this.create.apply(this, args);
          return;
        }

        callback(err, null, metadata);
        return;
      }

      callback(null, this, metadata);
    });
  }

  /**
   * Get the functions's metadata.
   *
   * @param {object} [options] Configuration options.
   * @param {FunctionCallback} [callback] Callback function.
   * @returns {Promise<CloudFunctionMetadata>}
   */
  getMetadata(options, callback?): void | Promise<CloudFunctionMetadata>{
    if (is.fn(options)) {
      callback = options;
      options = {};
    }

    this.request(
        {
          method: 'GET',
          uri: '',
          qs: options,
        },
        (err, resp) => {
          if (err) {
            callback(err, null, resp);
            return;
          }

          this.metadata = resp;

          callback(null, this.metadata, resp);
        });
  }

}

/*! Developer Documentation
 *
 * These methods can be auto-paginated.
 */
// paginator.extend(Function, '');

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(CloudFunction, {
  exclude: [],
});
