# CallerModule
Provides information about the caller of a method and its module

This module provides the ability to determine what module performed the most recent function call. It additionally provides information about the module such as:

- Its name
- Its root-path
- The path to the file that performed the function call
- The CallSite-object of the function call ([More about the CallSite class...](https://github.com/v8/v8/wiki/Stack-Trace-API#customizing-stack-traces))

## Installation
You can install this package using npm:
```cmd
npm install --save @manuth/caller-module
```

## Usage
TypeScript-example:
```ts
import { GetCallerModule } from "@manuth/caller-module";

console.log(GetCallerModule().name); // Logs the name of your module. 
```

```js
const { GetCallerModule } = require("@manuth/caller-module");
console.log(GetCallerModule().name);
```

### Documentation
`GetCallerModule([method: function], [level: number])`
 - `method`:  
   The method whose caller is to be determined.  
   Defaults to the GetCallerModule-method.
 - `level`:
   The number of levels above the `method` whose caller is to be determined.

### Example
```ts
import { GetCallerModule } from "@manuth/caller-module";

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
    console.log(GetCallerModule().name); // Your module's folder name.
    console.log(GetCallerModule().callSite.getFunctionName()); // last
    console.log(GetCallerModule(2).callSite.getFunctionName()); // test2
    console.log(GetCallerModule(last).callSite.getFunctionName()); // test2
    console.log(GetCallerModule(last, 2).callSite.getFunctionName()); // test1
}
```
