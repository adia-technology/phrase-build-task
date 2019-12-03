import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import nock from 'nock'
var fs = require('fs');
var sinon = require('sinon');
import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';


let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

sinon.stub(fs, 'createWriteStream').withArgs('SomeFile.xml').returns(new ObjectWritableMock())

tmr.setInput('phraseToken', '84eddb0b-b555-43e7-b2fd-68e7e7631c4e');
tmr.setInput('resourceFileName', 'SomeFile.xml');
tmr.setInput('phraseProject', 'ff9c4c33-3526-4e01-a716-6cbf555bd7fc');
tmr.setInput('phraseProjectLocale', 'b33c3522-abe4-4dfa-8aac-7a7d83cd4e6f');
tmr.setInput('phraseProjectFallbackLocale', '70151702-2634-4aca-a9b5-28b3df61b275');
tmr.setInput('resourceType', 'xml');

nock('https://api.phrase.com:443', {"encodedQueryParams":true})
    .get('/v2/projects/ff9c4c33-3526-4e01-a716-6cbf555bd7fc/locales/b33c3522-abe4-4dfa-8aac-7a7d83cd4e6f/download')
    .query({"file_format":"xml","include_empty_translations":"true","fallback_locale_id":"70151702-2634-4aca-a9b5-28b3df61b275"})
    .reply(200, "<translations></translations>")

tmr.run();

fs.createWriteStream.restore()
