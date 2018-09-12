# Google Cloud Functions Node.js Library

**Table of contents:**

* [Quickstart](#quickstart)
  * [Before you begin](#before-you-begin)
  * [Installing the client library](#installing-the-client-library)
  * [Using the client library](#using-the-client-library)
* [Samples](#samples)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [License](#license)

## Quickstart

### Before you begin

1.  Select or create a Cloud Platform project.

    [Go to the projects page][projects]

1.  Enable billing for your project.

    [Enable billing][billing]

1.  Enable the Google Cloud Functions.

    [Enable the API][enable_api]

1.  [Set up authentication with a service account][auth] so you can access the
    API from your local workstation.

[projects]: https://console.cloud.google.com/project
[billing]: https://support.google.com/cloud/answer/6293499#enable-billing
[enable_api]: https://console.cloud.google.com/flows/enableapi?apiid=cloudfunctions.googleapis.com
[auth]: https://cloud.google.com/docs/authentication/getting-started

### Installing the client library

    npm install --save vizzuality/googleapis-nodejs-functions

### Using the client library

```javascript

// Imports the Google Cloud client library
const { GCF } = require('../build/src'); // @TODO vizzuality/googleapis-nodejs-functions

// Your Google Cloud Platform project ID
const projectId = 'YOUR_PROJECT_ID';

// Creates a client
const gcf = new GCF({
  keyFilename: './credentials.json',
  projectId
});

// Get Functions and metadata
gcf
  .getFunctions()
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
```

## Samples


## Versioning


## Contributing


## License

Apache Version 2.0

See [LICENSE](LICENSE)
