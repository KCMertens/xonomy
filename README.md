# Xonomy

This is a Typescript port of Xonomy.
Available on NPM as [@elexis-eu/xonomy](https://www.npmjs.com/package/@elexis-eu/xonomy)

## Usage: 

### In a bundled project (rollup, webpack, etc.)
```javascript
import Xonomy from 'xonomy';

const x = new Xonomy();
// now use x as you would normally.
```


### In browser:
Add the following lines to your html:  
```html
<link rel="stylesheet" href="distr/xonomy.css">
<script src="dist/xonomy.umd.js">
```

This will set `window.Xonomy` to the Xonomy constructor.
Create an instance of the Xonomy editor as follows:
```javascript
const x = new Xonomy();
```
The `x` Xonomy instance can now be used as described in the [xonomy](./xonomy.pdf) manual.
Note that the document was written when Xonomy used a global instance, and so uses `Xonomy.someFunction()` for nearly every function, but in this version you should use the `x` instance instead.