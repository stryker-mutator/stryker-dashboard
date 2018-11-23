interface Constructor<T extends Object> {
  prototype: T;
}

export type JasmineMock<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] & jasmine.Spy : T[K];
};

export function mock<T>(constructor: Constructor<T>): JasmineMock<T> {
  const methodNames: string[] = [];
  for (const key in constructor.prototype) {
    if (constructor.prototype.hasOwnProperty(key)) {
      methodNames.push(key);
    }
  }
  return jasmine.createSpyObj(methodNames);
}
