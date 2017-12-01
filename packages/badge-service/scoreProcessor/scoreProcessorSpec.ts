import { assert, expect } from "chai";
import * as sinon from "sinon";

describe('postScoreFunction', () => {
  it('ShouldPost', () => {
      expect(1).to.equal(1)
  }),
  it('ShouldDie', () => {
    expect(1).to.equal(-1)    
  }),
  it('ShouldValidateHash', () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(TableService, azure.tab)
  })
});