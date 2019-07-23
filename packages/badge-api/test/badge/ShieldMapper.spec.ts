import { ShieldMapper } from '../../badge/ShieldMapper';
import * as sinon from 'sinon';
import { MutationTestingReport, MutationTestingReportMapper } from 'stryker-dashboard-data-access';
import { expect } from 'chai';
import { Shield, Color } from '../../badge/Shield';

describe(ShieldMapper.name, () => {

  let sut: ShieldMapper;
  let mutationTestingReportStub: sinon.SinonStubbedInstance<MutationTestingReportMapper>;

  beforeEach(() => {
    mutationTestingReportStub = {
      createStorageIfNotExists: sinon.stub(),
      findAll: sinon.stub(),
      findOne: sinon.stub(),
      insertOrMergeEntity: sinon.stub()
    };
    sut = new ShieldMapper(mutationTestingReportStub as any);
  });

  it('should find the correct mutation testing report', async () => {
    await sut.shieldFor('fooRepoSlug', 'barVersion', 'bazModule');
    expect(mutationTestingReportStub.findOne).calledWith({
      repositorySlug: 'fooRepoSlug',
      version: 'barVersion',
      moduleName: 'bazModule'
    });
  });

  it('should map to an "unknown" shield if mutation score is not found', async () => {
    mutationTestingReportStub.findOne.resolves(null);
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz');
    const expectedShield: Shield = {
      schemaVersion: 1,
      color: Color.Grey,
      label: 'Mutation score',
      message: 'unknown'
    };
    expect(actualShield).deep.eq(expectedShield);
  });

  it('should round percentage to 1 decimal place', async () => {
    arrangeMutationScore({ mutationScore: 85.23458 });
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz');
    expect(actualShield.message).eq('85.2%');
    expect(actualShield.label).eq('Mutation score');
  });

  it('should show 80% as green', async () => {
    arrangeMutationScore({ mutationScore: 80 });
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz');
    expect(actualShield.color).eq(Color.Green);
  });

  it('should show 79% < score < 80% as orange', async () => {
    arrangeMutationScore({ mutationScore: 79.94 });
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz');
    expect(actualShield.color).eq(Color.Orange);
  });

  it('should show 60% as orange', async () => {
    arrangeMutationScore({ mutationScore: 60 });
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz');
    expect(actualShield.color).eq(Color.Orange);
  });

  it('should show < 60% as red', async () => {
    arrangeMutationScore({ mutationScore: 59.94 });
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz');
    expect(actualShield.color).eq(Color.Red);
  });

  function arrangeMutationScore(overrides?: Partial<MutationTestingReport>) {
    const defaults: MutationTestingReport = {
      repositorySlug: 'foo/bar/baz',
      version: 'qux',
      mutationScore: 0,
      moduleName: undefined,
      result: null
    };
    mutationTestingReportStub.findOne.resolves({ ...defaults, ...overrides });
  }
});
