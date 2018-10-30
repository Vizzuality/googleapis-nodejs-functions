"use strict";
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
// Get Functions
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
// // Create a new Cloud Function
// const createCloudFunction = async(name): Promise<Operation>  => {
//   try {
//     const cloudFunctionConfig: CloudFunctionConfig = {
//       runtime: 'nodejs6',
//       sourceArchiveUrl: 'gs://wi__global__code/lib.zip',
//       eventTrigger: {
//         service: 'storage.googleapis.com',
//         eventType: 'google.storage.object.finalize',
//         resource: 'projects/_/buckets/wi__global__temp'
//       },
//       entryPoint: 'entrypoint'
//     }
//     const op: Operation = await (gcf.createCloudFunction(name, cloudFunctionConfig) as Promise<[Operation, any]>).then(value => value[0]);
//     console.log(op);
//     return op;
//   } catch (err) {
//     console.error(err);
//     throw Error(err);
//   }
// };
// const cloudFunctionName = 'test';
// createCloudFunction(cloudFunctionName);
// const getOperation = async(name): Promise<Operation>  => {
//   try {
//     const op: Operation = await (gcf.operation(name) as Promise<[Operation, any]>).then(value => value[0]);
//     //console.log(op);
//     return op;
//   } catch (err) {
//     console.error(err);
//     throw Error(err);
//   }
// };
// const operationName = 'operations/Y2FtZXJhdHJhcHJlcG8vdXMtY2VudHJhbDEvdGVzdC81RTZjQWwyU0NZRQ';
// getOperation(operationName);
const fn = gcf.cloudFunction('staging_project_1__check_object');
fn.delete();
//# sourceMappingURL=functions.js.map