const path = require('path');

// Imports the Google Cloud client library
const { GCF } = require('googleapis-nodejs-functions');

// Your Google Cloud Platform project ID
const projectId = 'cameratraprepo';

// Creates a client
const gcf = new GCF({
  keyFilename: `${path.join(__dirname, '../')}credentials.json`,
  projectId
});

// Get Functions
gcf
  .getCloudFunctions()
  .then(data => {
    const fns = data[0];
    //console.log('FUNCTIONS: ', fns);
    const fn = fns[0];
    fn.getMetadata()
    .then(data => {
      console.log('Function: ', data[0]);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
