"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ShieldMapper_1 = require("../../badge/ShieldMapper");
const sinon = require("sinon");
const stryker_dashboard_data_access_1 = require("stryker-dashboard-data-access");
const chai_1 = require("chai");
const Shield_1 = require("../../badge/Shield");
describe(ShieldMapper_1.ShieldMapper.name, () => {
    let sut;
    let mutationScoreMapper;
    beforeEach(() => {
        mutationScoreMapper = sinon.createStubInstance(stryker_dashboard_data_access_1.MutationScoreMapper);
        sut = new ShieldMapper_1.ShieldMapper(mutationScoreMapper);
    });
    it('should map shield with correct partition key', async () => {
        await sut.shieldFor('foo', 'bar', 'baz', undefined);
        chai_1.expect(mutationScoreMapper.select).calledWith('foo/bar/baz', '');
    });
    it('should map shield with correct row key', async () => {
        await sut.shieldFor('foo', 'bar', 'baz', 'qux');
        chai_1.expect(mutationScoreMapper.select).calledWith('foo/bar/baz', 'qux');
    });
    it('should map to an "unknown" shield if mutation score is not found', async () => {
        mutationScoreMapper.select.resolves(null);
        const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
        const expectedShield = {
            schemaVersion: 1,
            color: Shield_1.Color.Grey,
            label: 'Mutation score',
            message: 'unknown'
        };
        chai_1.expect(actualShield).deep.eq(expectedShield);
    });
    it('should round percentage to 1 decimal place', async () => {
        arrangeMutationScore({ score: 85.23458 });
        const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
        chai_1.expect(actualShield.message).eq('85.2%');
        chai_1.expect(actualShield.label).eq('Mutation score');
    });
    it('should show 80% as green', async () => {
        arrangeMutationScore({ score: 80 });
        const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
        chai_1.expect(actualShield.color).eq(Shield_1.Color.Green);
    });
    it('should show 79% < score < 80% as orange', async () => {
        arrangeMutationScore({ score: 79.94 });
        const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
        chai_1.expect(actualShield.color).eq(Shield_1.Color.Orange);
    });
    it('should show 60% as orange', async () => {
        arrangeMutationScore({ score: 60 });
        const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
        chai_1.expect(actualShield.color).eq(Shield_1.Color.Orange);
    });
    it('should show < 60% as red', async () => {
        arrangeMutationScore({ score: 59.94 });
        const actualShield = await sut.shieldFor('foo', 'bar', 'baz', undefined);
        chai_1.expect(actualShield.color).eq(Shield_1.Color.Red);
    });
    function arrangeMutationScore(overrides) {
        const defaults = {
            slug: 'foo/bar/baz',
            branch: 'qux',
            score: 0
        };
        mutationScoreMapper.select.resolves(Object.assign({}, defaults, overrides));
    }
});
//# sourceMappingURL=ShieldMapper.spec.js.map