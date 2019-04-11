import { ShieldMapper } from '../../badge/ShieldMapper';
import * as sinon from 'sinon';
import { MutationScoreMapper, MutationScore } from 'stryker-dashboard-data-access';
import { expect } from 'chai';
import { Shield, Color } from '../../badge/Shield';

describe(ShieldMapper.name, () => {

  let sut: ShieldMapper;
  let mutationScoreMapper: sinon.SinonStubbedInstance<MutationScoreMapper>;

  beforeEach(() => {
    mutationScoreMapper = sinon.createStubInstance(MutationScoreMapper);
    sut = new ShieldMapper(mutationScoreMapper as any);
  });

  it('should map shield with correct partition key', async () => {
    await sut.shieldFor('foo', 'bar', 'baz', undefined);
    expect(mutationScoreMapper.select).calledWith('foo/bar/baz', '');
  });

  it('should map shield with correct row key', async () => {
    await sut.shieldFor('foo', 'bar', 'baz', 'qux');
    expect(mutationScoreMapper.select).calledWith('foo/bar/baz', 'qux');
  });

  it('should map to an "unknown" shield if mutation score is not found', async () => {
    mutationScoreMapper.select.resolves(null);
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
    const expectedShield: Shield = {
      schemaVersion: 1,
      color: Color.Grey,
      label: 'Mutation score',
      message: 'unknown'
    };
    expect(actualShield).deep.eq(expectedShield);
  });

  it('should round percentage to 1 decimal place', async () => {
    arrangeMutationScore({ score: 85.23458 });
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
    expect(actualShield.message).eq('85.2%');
    expect(actualShield.label).eq('Mutation score');
  });

  it('should show 80% as green', async () => {
    arrangeMutationScore({ score: 80 });
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
    expect(actualShield.color).eq(Color.Green);
  });

  it('should show 79% < score < 80% as orange', async () => {
    arrangeMutationScore({ score: 79.94 });
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
    expect(actualShield.color).eq(Color.Orange);
  });

  it('should show 60% as orange', async () => {
    arrangeMutationScore({ score: 60 });
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
    expect(actualShield.color).eq(Color.Orange);
  });

  it('should show < 60% as red', async () => {
    arrangeMutationScore({ score: 59.94 });
    const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
    expect(actualShield.color).eq(Color.Red);
  });

  function arrangeMutationScore(overrides?: Partial<MutationScore>) {
    const defaults: MutationScore = {
      slug: 'foo/bar/baz',
      branch: 'qux',
      score: 0
    };
    mutationScoreMapper.select.resolves({ ...defaults, ...overrides });
  }
});
