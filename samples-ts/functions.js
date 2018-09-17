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
const { GCF } = require('googleapis-nodejs-functions');
// Your Google Cloud Platform project ID
const projectId = 'cameratraprepo';
// Creates a client
const gcf = new GCF({
    keyFilename: `${path.join(__dirname, '../')}credentials.json`,
    projectId
});
// Get Functions
const getCloudFunctions = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const fns = yield gcf.getCloudFunctions().then(value => value[0]);
        const fn0 = fns[0];
        const fn0Metadata = yield fn0.getMetadata({}).then(value => value[0]);
        console.log(fn0Metadata);
        return fns;
    }
    catch (err) {
        console.error(err);
        throw Error(err);
    }
});
getCloudFunctions();
//# sourceMappingURL=functions.js.map