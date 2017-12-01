declare const sandbox: sinon.SinonSandbox;
namespace NodeJS {
  export interface Global {
    sandbox: sinon.SinonSandbox;
  }
}

interface Blob { }
interface XMLHttpRequest { };