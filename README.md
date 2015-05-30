# Scroll-Reportage about Uranium Extraction in Mongolia #

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

## Release to a S3 Instance ##
```bash
cp aws.json.default aws.json

# Add your credentials to aws.json

# Upload changed files to /mongolei/ and invalidate
# /mongolei/{language}/index.html
grunt release
```
