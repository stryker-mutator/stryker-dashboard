import * as sinon from 'sinon';
import { Type } from 'ts-express-decorators';

export type Mock<T> = {
    [K in keyof T]: sinon.SinonStub;
}

export function createMock<T>(ConstructorFn: Type<T>): Mock<T> {
    return sinon.createStubInstance(ConstructorFn);
}