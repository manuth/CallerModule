# CallerModule
Provides information about the caller of a method and its module.

This module provides the abillity to determine what module performed the most recent function call. It additionally provides information about the module such as:

- Its name
- Its root-path
- The path to the file that performed the function call
- The CallSite-object of the function call ([More about the CallSite class...](https://github.com/v8/v8/wiki/Stack-Trace-API#customizing-stack-traces))

## Installation
You can install this package using npm:
```cmd
npm install --save caller-module
```

## Usage
TypeScript-example:
```ts
import * as callerModule from 'caller-module';

console.log(callerModule.GetCallerModule().name); // Logs the name of your module. 
```

```js
const callerModule = require('caller-module').GetCallerModule;
console.log(callerModule().name);
```

### Documentation
`require('caller-module').GetCallerModule([method: function], [level: number])`
 - `method`:  
   The method whose caller is to be determined.  
   Defaults to the GetCallerModule-method.
 - `level`:
   The number of levels above the `method` whose caller is to be determined.

### Example
```ts
import * as callerModule from 'caller-module';

function test
{
    test1();
}

function test1()
{
    test2();
}

function test2()
{
    last();
}

function last()
{
    console.log(callerModule.GetCallerModule().name); // Your module's folder name.
    console.log(callerModule.GetCallerModule().callSite.getFunctionName()); // last
    console.log(callerModule.GetCallerModule(2).callSite.getFunctionName()); // test2
    console.log(callerModule.GetCallerModule(last).callSite.getFunctionName()); // test2
    console.log(callerModule.GetCallerModule(last, 2).callSite.getFunctionName()); // test1
}
```