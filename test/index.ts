/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

import * as arrify from 'arrify';
import * as assert from 'assert';
import * as extend from 'extend';
import * as nodeutil from 'util';
import * as proxyquire from 'proxyquire';
import * as uuid from 'uuid';
import * as pfy from '@google-cloud/promisify';
import {Service, util} from '@google-cloud/common';
import {CloudFunction} from '../src/cloudfunction';

const fakeUuid = extend(true, {}, uuid);

function FakeApiError() {
  this.calledWith_ = arguments;
}

let promisified = false;
const fakePfy = extend({}, pfy, {
  promisifyAll: (Class, options) => {
    if (Class.name !== 'GCF') {
      return;
    }

    promisified = true;
    assert.deepStrictEqual(options.exclude, [
      'cloudFunction'
    ]);
  },
});
const fakeUtil = extend({}, util, {
  ApiError: FakeApiError,
});
const originalFakeUtil = extend(true, {}, fakeUtil);

function FakeDataset() {
  this.calledWith_ = arguments;
}

class FakeCloudFunction extends CloudFunction {
  constructor(a, b) {
    super(a, b);
  }
}

let extended = false;
const fakePaginator = {
  paginator: {
    extend: (Class, methods) => {
      if (Class.name !== 'GCF') {
        return;
      }

      methods = arrify(methods);
      assert.strictEqual(Class.name, 'GCF');
      assert.deepStrictEqual(methods, ['getCloudFunctions']);
      extended = true;
    },
  }
};

function FakeService() {
  this.calledWith_ = arguments;
  Service.apply(this, arguments);
}

nodeutil.inherits(FakeService, Service);

describe('GCF', () => {
  const PROJECT_ID = 'test-project';
  const LOCATION = 'us-central1';

  let GCFCached;
  let GCF;
  let gcf;

  before(() => {
    GCF = proxyquire('../src', {
      uuid: fakeUuid,
      './cloudfunction': {
        CloudFunction: FakeCloudFunction,
      },
      '@google-cloud/common': {
        Service: FakeService,
        util: fakeUtil,
      },
      '@google-cloud/paginator': fakePaginator,
      '@google-cloud/promisify': fakePfy,
    }).GCF;
    GCFCached = extend({}, GCF);
  });

  beforeEach(() => {
    extend(fakeUtil, originalFakeUtil);
    GCF = extend(GCF, GCFCached);
    gcf = new GCF({projectId: PROJECT_ID});
  });

  describe('instantiation', () => {
    it('should extend the correct methods', () => {
      assert(extended); // See `fakePaginator.extend`
    });

    it('should promisify all the things', () => {
      assert(promisified);
    });

    it('should inherit from Service', () => {
      assert(gcf instanceof Service);

      const calledWith = gcf.calledWith_[0];

      const baseUrl = 'https://cloudfunctions.googleapis.com/v1';
      assert.strictEqual(calledWith.baseUrl, baseUrl);
      assert.deepStrictEqual(calledWith.scopes, [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/cloudfunctions'
      ]);
      assert.deepStrictEqual(
        calledWith.packageJson,
        require('../../package.json')
      );
    });

    it('should capture any user specified location', () => {
      const gcf = new GCF({
        projectId: PROJECT_ID
      },
        LOCATION
      );

      assert.strictEqual(gcf.location, LOCATION);
    });

  });

});
