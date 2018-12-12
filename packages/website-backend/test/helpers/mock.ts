import * as sinon from 'sinon';

export function createMock<T>(ConstructorFn: sinon.StubbableType<T>): sinon.SinonStubbedInstance<T> {
    return sinon.createStubInstance(ConstructorFn);
}