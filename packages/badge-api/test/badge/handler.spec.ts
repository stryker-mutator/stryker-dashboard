import { handler } from '../../badge/handler.js';
import { ShieldMapper } from '../../badge/ShieldMapper.js';
import sinon, { SinonStubbedInstance } from 'sinon';
import fs from 'fs';
import { HttpHandler, HttpRequest, InvocationContext } from '@azure/functions';
import { Color, Shield } from '../../badge/Shield.js';
import { expect } from 'chai';
import { InvalidSlugError } from '@stryker-mutator/dashboard-common';

const headers = {
  ['X-Badge-Api-Version']: JSON.parse(
    fs.readFileSync(new URL('../../../package.json', import.meta.url), 'utf-8'),
  ).version,
};

describe(handler.name, () => {
  let shieldMapperStub: sinon.SinonStubbedInstance<ShieldMapper>;
  let sut: HttpHandler;

  beforeEach(() => {
    shieldMapperStub = sinon.createStubInstance(ShieldMapper);
    sut = handler(shieldMapperStub);
  });

  it('should return the given mapped shield', async () => {
    // Arrange
    const expectedShield: Shield = {
      schemaVersion: 1,
      label: 'Mutation Testing',
      message: '80%',
      color: Color.Green,
      namedLogo: 'stryker',
      logoColor: Color.WhiteSmoke,
    };
    shieldMapperStub.shieldFor.resolves(expectedShield);
    const context = createContext();

    // Act
    const res = await sut(...context);

    // Assert
    expect(res).deep.eq({
      jsonBody: expectedShield,
      headers,
    });
  });

  it('should determine correct version', async () => {
    const context = createContext({
      params: { slug: 'foo/bar/baz/qux' },
    });
    await sut(...context);
    expect(shieldMapperStub.shieldFor).calledWith(
      'foo/bar/baz',
      'qux',
      undefined,
    );
  });

  it('should use module query string argument when it is presented', async () => {
    const context = createContext({
      params: { slug: 'foo/bar/baz/qux' },
      query: new URLSearchParams({ module: 'quux' }),
    });
    await sut(...context);
    expect(shieldMapperStub.shieldFor).calledWith('foo/bar/baz', 'qux', 'quux');
  });

  it('should remove trailing slash from url', async () => {
    const context = createContext({
      params: { slug: 'foo/bar/baz/qux/' },
    });
    await sut(...context);
    expect(shieldMapperStub.shieldFor).calledWith(
      'foo/bar/baz',
      'qux',
      undefined,
    );
  });

  it('should return BadRequest when the slug is missing', async () => {
    const context = createContext({
      params: {},
      query: new URLSearchParams({ invocationId: '' }),
    });
    const res = await sut(...context);
    expect(res).deep.eq({
      status: 400,
      headers,
      body: 'Missing slug',
    });
  });

  it('should log BadRequest on info', async () => {
    const context = createContext({
      params: {},
      query: new URLSearchParams({ invocationId: '' }),
    });
    await sut(...context);
    expect(context[1].info).calledWith(
      'Handling invalid request: ',
      sinon.match.instanceOf(InvalidSlugError),
    );
  });

  it('should return BadRequest when version is missing', async () => {
    const context = createContext({
      params: { slug: 'foo/' },
    });
    const res = await sut(...context);
    expect(res).deep.eq({
      status: 400,
      headers,
      body: 'Missing version in "foo"',
    });
  });

  function createContext(
    requestOverrides?: Partial<HttpRequest>,
    contextOverrides?: Partial<InvocationContext>,
  ): [HttpRequest, InvocationContext] {
    const log = createLogStub();
    const contextDefaults: InvocationContext = {
      ...log,

      invocationId: '32',
      traceContext: {
        attributes: undefined,
        // traceparent: undefined,
        // tracestate: undefined,
      },
      functionName: 'fn',
      extraInputs: {
        get: sinon.stub(),
        set: sinon.stub(),
      },
      extraOutputs: {
        get: sinon.stub(),
        set: sinon.stub(),
      },
      options: {
        trigger: {
          name: 'fn',
          type: 'httpTrigger',
        },
        extraOutputs: [],
        extraInputs: [],
      },
    };
    const context: InvocationContext = {
      ...contextDefaults,
      ...contextOverrides,
      ...log,
    };

    const requestDefaults: HttpRequest = {
      params: { slug: 'github.com/stryker-mutator/stryker/master' } as Record<
        string,
        string
      >,
      query: new URLSearchParams(),
    } as HttpRequest;
    const request: HttpRequest = {
      ...requestDefaults,
      ...requestOverrides,
    };

    return [request, context];
  }

  function createLogStub(): SinonStubbedInstance<
    Pick<
      InvocationContext,
      'log' | 'debug' | 'info' | 'error' | 'warn' | 'trace'
    >
  > {
    return {
      trace: sinon.stub(),
      debug: sinon.stub(),
      info: sinon.stub(),
      error: sinon.stub(),
      warn: sinon.stub(),
      log: sinon.stub(),
    };
  }
});
