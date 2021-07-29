# 🐾 Dog finder

Stack:
- Web Components (`lit`)
- TypeScript
- Jest
- Webpack
- ESLint
- Prettier

### To run the project locally
```
npm install
npm run serve
```

### To run tests
```
npm run test
```

### To check types
```
npm run types
```

### Linting commands
```
npm run lint
npm run lint:css
npm run lint:css:fix
npm run lint:ts
npm run lint:ts:fix
```

### Building commands
```
npm run build:dev
npm run build:prod
```

## Design choices
- `Lit` - small, up-to-date library for web components, provides solutions for common problems like component state reactivity or template system

## Issues
- There are still some colliding rules in currently used ESLint packages
- We're not able to 'stylelint' styles nested in lit elements (in css``), stylelint library doesn't support that yet, the alternative is to use `stylelint-processor-styled-components` processor, but by using processors we’re not able to run stylelint with —fix option (automatically fix), I couldn’t quickly find any good solution for linting styles in Lit template literals.
- Jest config adjustments required to properly process *.spec.ts files