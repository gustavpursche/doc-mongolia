# Scroll-Reportage about Uranium Extraction in Mongolia #

Used Software:
- ScrollMagic
- GSAP
- jQuery
- webfontloader
- Grunt

## Local Installation ##
```bash
npm install && bower install

# Build Dev Enviroment
grunt replace:dev

# Build Production Enviroment
grunt build

# NOTE
# After the production enviroment was built, the file-paths in /{language}/dist/index.html have to be rewritten. To do so, please run `grunt replace:dev` again

# Run on http://localhost:3000
node server.js
```

## Watch for Changes ##

There are grunt tasks for the following files:
- /{language}/dev/index.html
- /less/*.less

```bash
grunt watch
```
