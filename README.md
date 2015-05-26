# Scroll-Reportage about Uranium Extraction in Mongolia #

Used Software:
- Colorbox
- Grunt
- GSAP
- jQuery
- Slick
- ScrollMagic
- webfontloader

## Local Installation ##
```bash
npm install && bower install

# Build Production Environment
grunt build

# Build Dev Environment
grunt replace:dev

# NOTE
# After the production environment was built, the file-paths in
# /{language}/dist/index.html have to be rewritten. To do so, please
# run `grunt replace:dev` again

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
