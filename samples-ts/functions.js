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
const src_1 = require("../build/src");
// Your Google Cloud Platform project ID
const projectId = 'cameratraprepo';
// Creates a client
const gcf = new src_1.GCF({
    keyFilename: `${path.join(__dirname, '../')}credentials.json`,
    projectId
});
// Get Functions
const getCloudFunctions = () => __awaiter(this, void 0, void 0, function* () {
    return yield gcf.getCloudFunctions();
});
getCloudFunctions()
    .then(value => {
    const fns = value[0];
    const fn0 = fns[0];
    const fnmPromise = fn0.getMetadata({});
    fnmPromise
        .then(value => {
        const fn0Metadata = value[0];
        console.log(fn0Metadata);
    })
        .catch(err => {
        console.log(err);
    });
})
    .catch(err => {
    console.log(err);
});
//# sourceMappingURL=functions.js.map