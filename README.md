# node-require-me



# node-require-me

> allows requiring of the current module by the name specified in the package.json

When developing a node.js package, you will often find it is a nightmare to refer to your package from within itself. You will often resort to code like:

```js
const OurFramework = require('../../../index.js');
```

This package allows you to refer to your own package with the name you specified in the `package.json` file. For example:
```js
const OurFramework = require('our-framework');
```

Usage is fairly simple, in your main file (`index.js`) you should simply add this line of code:
```js
require('require-me')(__dirname);
```

## Documentation
The `require-me` package exports a single function, that accepts a single argument:

### require_me(string rootPath)
**rootPath**: The root folder of your project, this folder will be scanned for a package.json file and will be processed.

This function returns an object of the following format:
```js
{
	RequireOverrideError: ..., // All errors inherit this class, this can be used for comparison
	Instance: ...              // The running instance of the require() interceptor
}
```

### Instance
Once initialised, the interceptor provides a set of methods for handling updates:

### setPath(string rootPath)
**rootPath**: The root folder of your project, this folder will be scanned for a package.json file and will be processed.

Updates the root path of the running instance. This will automatically trigger package redetection.

### detectPackage()
Attempt to detect the `package.json` file in the root path. If found, the interceptor will be updated. If not found, an error will be thrown.
