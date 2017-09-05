import * as assert from 'assert';
import * as callerModule from '../main';

describe('CallerModule', () =>
{
  it('Determining the caller-module of `testCallerModule`... (exceptiong `mocha`)', function testCallerModule()
  {
    assert.strictEqual(callerModule.GetCallerModule(testCallerModule).name, 'mocha');
  });
  it ('Determining the caller of the current context... (excepting `CallerModule`)', () =>
  {
    assert.strictEqual(callerModule.GetCallerModule().name, 'CallerModule');
  });
});