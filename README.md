# Azure Dev Ops extension: Phrase Buld tasks

# Manual build steps

    cd phraseUploadResource/
    npm install --production
    npm run build
    cd ..
    cd phraseDownloadResource/
    npm install  --production
    npm run build
    cd ..
    tfx extension create --manifest-globs vss-extension.json

Soon to be automated.

# Attribution

Icons come from https://freeicons.io/