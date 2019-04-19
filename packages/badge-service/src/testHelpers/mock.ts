export type Mock<T> = {
    [K in keyof T]: sinon.SinonStub;
  };
