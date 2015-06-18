Web-Scroll-Reportage about uranium mining and consequences for for the nomads in Mongolia

- Authors: https://jib-collective.net
- Publication Date: 2015/07/16
- URL: https://jib-collective.net/stories/mongolia/

## Installation ##
```bash
npm install && bower install
```

## Watch for Changes ##
```bash
grunt watch
```

## Run local server ##
```bash
# Run on http://localhost:3000
node server.js
```

## Build Production Environment ##
```bash
grunt build
```

## Release to a S3 ##
```bash
cp aws.json.default aws.json

# Add your credentials to aws.json

# Upload changed files to /mongolei/ and invalidate
# /mongolei/{language}/index.html
grunt release
```
