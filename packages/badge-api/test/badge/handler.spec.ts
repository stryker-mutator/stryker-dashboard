import { handler } from '../../badge/handler';
import { ShieldMapper } from '../../badge/ShieldMapper';
import * as sinon from 'sinon';
import { AzureFunction, Context } from '@azure/functions';
import { Color, Shield } from '../../badge/Shield';
import { expect } from 'chai';
import { InvalidSlugError } from '@stryker-mutator/dashboard-data-access';

const headers = { ['X-Badge-Api-Version']: require('../../../package.json').version };

describe(handler.name, () => {
  let shieldMapperStub: sinon.SinonStubbedInstance<ShieldMapper>;
  let sut: AzureFunction;

  beforeEach(() => {
    shieldMapperStub = sinon.createStubInstance(ShieldMapper);
    sut = handler(shieldMapperStub as unknown as ShieldMapper);
  });

  it('should return the given mapped shield', async () => {
    // Arrange
    const expectedShield: Shield = {
      color: Color.Green,
      label: 'Mutation Testing',
      message: '80%',
      schemaVersion: 1
    };
    shieldMapperStub.shieldFor.resolves(expectedShield);
    const context = createContext();

    // Act
    await sut(context);

    // Assert
    expect(context.res).deep.eq({
      body: expectedShield,
      headers
    });
  });

  it('should determine correct version', async () => {
    const context = createContext({ bindingData: { slug: 'foo/bar/baz/qux' } });
    await sut(context);
    expect(shieldMapperStub.shieldFor).calledWith('foo/bar/baz', 'qux', undefined);
  });

  it('should use module query string argument when it is presented', async () => {
    const context = createContext({ bindingData: { slug: 'foo/bar/baz/qux', module: 'quux' } });
    await sut(context);
    expect(shieldMapperStub.shieldFor).calledWith('foo/bar/baz', 'qux', 'quux');
  });

  it('should remove trailing slash from url', async () => {
    const context = createContext({ bindingData: { slug: 'foo/bar/baz/qux/' } });
    await sut(context);
    expect(shieldMapperStub.shieldFor).calledWith('foo/bar/baz', 'qux', undefined);
  });

  it('should return BadRequest when the slug is missing', async () => {
    const context = createContext({ bindingData: {} });
    await sut(context);
    expect(context.res).deep.eq({
      status: 400,
      headers,
      body: 'Missing repositorySlug'
    });
  });

  it('should log BadRequest on info', async () => {
    const context = createContext({ bindingData: {} });
    await sut(context);
    expect(context.log.info).calledWith('Handling invalid request: ', sinon.match.instanceOf(InvalidSlugError));
  });

  it('should return BadRequest when version is missing', async () => {
    const context = createContext({ bindingData: { slug: 'foo/' } });
    await sut(context);
    expect(context.res).deep.eq({
      status: 400,
      headers,
      body: 'Missing version for slug "foo"'
    });
  });

  function createContext(overrides?: Partial<Context>): Context {
    const defaults: Context = {
      bindingData: {
        slug: 'github.com/stryker-mutator/stryker/master'
      },
      bindingDefinitions: [],
      bindings: {},
      executionContext: {
        invocationId: 'in',
        functionName: 'fn',
        functionDirectory: 'fnDir',
      },
      log: createLogStub(),
      invocationId: '32',
      done: sinon.stub()
    };
    return {
      ...defaults,
      ...overrides
    };
  }

  function createLogStub() {
    const log = () => { };
    log.verbose = sinon.stub();
    log.info = sinon.stub();
    log.error = sinon.stub();
    log.warn = sinon.stub();
    return log;
  }
});
