import tl = require('azure-pipelines-task-lib/task');
import request = require('request');
import fs = require('fs');
import HttpStatus = require('http-status-codes');

async function run() {
    try {
        const phraseToken: string | undefined = tl.getInput('phraseToken', true);
        if (phraseToken == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        const resourceFileName: string | undefined = tl.getInput('resourceFileName', true);
        if (resourceFileName == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        const phraseProject: string | undefined = tl.getInput('phraseProject', true);
        if (phraseProject == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        const phraseProjectLocale: string | undefined = tl.getInput('phraseProjectLocale', true);
        if (phraseProjectLocale == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        const resourceType: string | undefined = tl.getInput('resourceType', true);
        if (resourceType == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }

        const options = {
            url: `https://api.phrase.com/v2/projects/${phraseProject}/uploads`,
            headers: {
                Authorization: `token ${phraseToken}`
            }
        };

        let req: request.Request = request.post(options, function (err, resp, body) {
            if (err) {
                tl.setResult(tl.TaskResult.Failed, err.message);
            } else if (resp && resp.statusCode) {
                console.log(`Uploaded file ${resourceFileName}`)
            } else {
                tl.setResult(tl.TaskResult.Failed, "Unkonwn error occured");
            }
        });
        let form = req.form();
        form.append('file', fs.createReadStream(`${resourceFileName}`));
        form.append('file_format', resourceType);
        form.append('locale_id', phraseProjectLocale);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();