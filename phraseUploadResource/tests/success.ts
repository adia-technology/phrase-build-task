import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import nock from 'nock'
import {ObjectReadableMock} from 'stream-mock';

var sinon = require('sinon');
var fs = require('fs');

sinon.stub(fs, 'createReadStream').withArgs('SomeFile.xml').returns(new ObjectReadableMock("<translations></translations>"))

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('phraseToken', '84eddb0b-b555-43e7-b2fd-68e7e7631c4e');
tmr.setInput('resourceFileName', 'SomeFile.xml');
tmr.setInput('phraseProject', 'ff9c4c33-3526-4e01-a716-6cbf555bd7fc');
tmr.setInput('phraseProjectLocale', 'b33c3522-abe4-4dfa-8aac-7a7d83cd4e6f');
tmr.setInput('resourceType', 'xml');

nock('https://api.phrase.com:443',
    {
        encodedQueryParams: true,
        reqheaders: {
            authorization: 'token 84eddb0b-b555-43e7-b2fd-68e7e7631c4e'
        }
    })
    .post('/v2/projects/ff9c4c33-3526-4e01-a716-6cbf555bd7fc/uploads')
    .reply(200)

tmr.run();

fs.createReadStream.restore()

