import tl = require('azure-pipelines-task-lib/task');
import https = require('https');
import fs = require('fs');

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
        const phraseProjectFallbackLocale: string | undefined = tl.getInput('phraseProjectFallbackLocale', false);
        if (phraseProjectLocale == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        const resourceType: string | undefined = tl.getInput('resourceType', true);
        if (resourceType == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }

        const file = fs.createWriteStream(`${resourceFileName}`);
        file.on('finish', () => {
            console.log(`Written file ${resourceFileName}`)
        })

        const options = {
            hostname: 'api.phrase.com',
            path: `/${phraseProject}/locales/${phraseProjectLocale}/download?file_format=${resourceType}&include_empty_translations=true&fallback_locale_id=${phraseProjectFallbackLocale}`,
            headers: {
                Authorization: `token ${phraseToken}`
            }
        };

        const request = https.get(options, function(response) {
            response.pipe(file);
        });

    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();