import * as sinon from "sinon";


export type Mock<T> = {
    [K in keyof T]: sinon.SinonStub;
}

export function mock<T>(Constructor: { new(...args: any[]): T }): Mock<T> {
    return sinon.createStubInstance(Constructor) as Mock<T>;
}