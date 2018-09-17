
const path = require('path');

// Imports the Google Cloud client library
import { CloudFunctionMetadata, CloudFunction } from 'googleapis-nodejs-functions';
const { GCF } = require('googleapis-nodejs-functions');

// Your Google Cloud Platform project ID
const projectId = 'cameratraprepo';

// Creates a client
const gcf = new GCF({
  keyFilename: `${path.join(__dirname, '../')}credentials.json`,
  projectId
});

// Get Functions
const getCloudFunctions = async(): Promise<CloudFunction[]>  => {
  try {
    const fns: CloudFunction[] = await (gcf.getCloudFunctions() as Promise<[CloudFunction[], any]>).then(value => value[0]);
    const fn0: CloudFunction = fns[0];
    const fn0Metadata = await (fn0.getMetadata({}) as Promise<CloudFunctionMetadata>).then(value => value[0]);
    console.log(fn0Metadata);
    return fns;
  } catch (err) {
    console.error(err);
    throw Error(err);
  }
};

getCloudFunctions();
