import { expect } from 'chai';
import { constructApiUri } from '../../src/Uri.js';

describe(constructApiUri.name, () => {
  it('should return the default API uri when params are empty', () => {
    const uri = constructApiUri('github.com/user/project', {
      module: undefined,
      realTime: undefined,
    });

    expect(uri).to.eq('/api/reports/github.com/user/project');
  });

  it('should return the API uri with the module as query param', () => {
    const uri = constructApiUri('github.com/user/project', {
      module: 'project-submodule',
      realTime: undefined,
    });

    expect(uri).to.eq(
      '/api/reports/github.com/user/project?module=project-submodule'
    );
  });

  it('should return the API uri with realTime as query param', () => {
    const uri = constructApiUri('github.com/user/project', {
      module: undefined,
      realTime: 'true',
    });

    expect(uri).to.eq('/api/reports/github.com/user/project?realTime=true');
  });

  it('should return the API uri with both the module and realTime query param', () => {
    const uri = constructApiUri('github.com/user/project', {
      module: 'project-submodule',
      realTime: 'true',
    });

    expect(uri).to.eq(
      '/api/reports/github.com/user/project?module=project-submodule&realTime=true'
    );
  });
});
