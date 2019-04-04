import * as sinon from "sinon";

export function mock<T>(Constructor: { new(...args: any[]): T }): Mock<T> {
  return sinon.createStubInstance(Constructor) as Mock<T>;
}

export type Mock<T> = {
  [K in keyof T]: sinon.SinonStub;
};