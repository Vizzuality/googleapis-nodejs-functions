
const path = require('path');

// Imports the Google Cloud client library
import { GCF } from '../build/src';
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
  console.log(fn0);
})
.catch(err => {
  console.log(err);
})
