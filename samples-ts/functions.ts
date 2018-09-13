
const path = require('path');

// Imports the Google Cloud client library
import { GCF, CloudFunctionMetadata } from '../build/src';
import { CloudFunction } from '../build/src/cloudfunction';

// Your Google Cloud Platform project ID
const projectId = 'cameratraprepo';

// Creates a client
const gcf = new GCF({
  keyFilename: `${path.join(__dirname, '../')}credentials.json`,
  projectId
});

// Get Functions
const getCloudFunctions = async(): Promise<[CloudFunction[], any]>  => {
  return await gcf.getCloudFunctions() as [CloudFunction[], any];
};

getCloudFunctions()
.then(value => {
  const fns: CloudFunction[] = value[0];
  const fn0: CloudFunction = fns[0];
  const fnmPromise = fn0.getMetadata({}) as Promise<CloudFunctionMetadata>;
  fnmPromise
  .then(value => {
    const fn0Metadata: CloudFunctionMetadata = value[0];
    console.log(fn0Metadata);
  })
  .catch(err => {
    console.log(err);
  });
})
.catch(err => {
  console.log(err);
})
