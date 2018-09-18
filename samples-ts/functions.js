"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
// Imports the Google Cloud client library
//import { CloudFunctionMetadata, CloudFunction } from 'googleapis-nodejs-functions';
//const { GCF } = require('googleapis-nodejs-functions');
const src_1 = require("../build/src");
// Your Google Cloud Platform project ID
const projectId = 'cameratraprepo';
// Creates a client
const gcf = new src_1.GCF({
    keyFilename: `${path.join(__dirname, '../')}credentials.json`,
    projectId
});
// // Get Functions
// const getCloudFunctions = async(): Promise<CloudFunction[]>  => {
//   try {
//     const fns: CloudFunction[] = await (gcf.getCloudFunctions() as Promise<[CloudFunction[], any]>).then(value => value[0]);
//     const fn0: CloudFunction = fns[0];
//     const fn0Metadata: CloudFunctionMetadata = fn0.metadata;
//     console.log(fn0Metadata.runtime);
//     return fns;
//   } catch (err) {
//     console.error(err);
//     throw Error(err);
//   }
// };
// getCloudFunctions();
// create a new Cloud Function
const createCloudFunction = (name) => __awaiter(this, void 0, void 0, function* () {
    try {
        const cloudFunctionConfig = {
            runtime: 'nodejs6',
            sourceArchiveUrl: 'gs://wi__global__code/lib.zip',
            eventTrigger: {
                service: 'storage.googleapis.com',
                eventType: 'google.storage.object.finalize',
                resource: 'projects/_/buckets/wi__global__temp'
            },
            entryPoint: 'entrypoint'
        };
        const op = yield gcf.createCloudFunction(name, cloudFunctionConfig).then(value => value[0]);
        console.log(op);
        return op;
    }
    catch (err) {
        console.error(err);
        throw Error(err);
    }
});
const cloudFunctionName = 'test';
createCloudFunction(cloudFunctionName);
//# sourceMappingURL=functions.js.map