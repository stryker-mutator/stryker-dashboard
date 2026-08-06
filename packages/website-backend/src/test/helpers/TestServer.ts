import { AuthTokenCodec } from '@stryker-mutator/dashboard-common/crypto';
import type { ProjectMapper } from '@stryker-mutator/dashboard-data-access';
import * as dal from '@stryker-mutator/dashboard-data-access';
import sinon from 'sinon';

import type * as github from '../../github/models.js';
import type Configuration from '../../services/Configuration.js';
import type DataAccess from '../../services/DataAccess.js';

export const config: Configuration = {
  githubClientId: 'githubClientId',
  githubSecret: 'githubSecret',
  baseUrl: 'baseUrl',
  jwtSecret: 'jwtSecret',
  isDevelopment: true,
  cors: '*',
};

const codec = new AuthTokenCodec(config.jwtSecret);

/**
 * Creates an encrypted JWT (JWE) the same way the backend does.
 */
export function createToken(user: github.Authentication): Promise<string> {
  return codec.create({ ...user });
}

/**
 * Reads back an encrypted JWT (JWE) the backend handed out.
 */
export function readToken(token: string): Promise<github.Authentication> {
  return codec.read<github.Authentication>(token);
}

export async function createAuthorizationHeader(user: github.Authentication) {
  const token = await createToken(user);
  return `Bearer ${token}`;
}

export class ConfigurationStub implements Configuration {
  constructor() {
    this.githubClientId = config.githubClientId;
    this.githubSecret = config.githubSecret;
    this.baseUrl = config.baseUrl;
    this.jwtSecret = config.jwtSecret;
    this.isDevelopment = config.isDevelopment;
    this.cors = config.cors;
  }
  public githubClientId: string;
  public githubSecret: string;
  public baseUrl: string;
  public jwtSecret: string;
  public isDevelopment: boolean;
  public cors: string;
}

type IDataAccessMock = {
  [Prop in keyof DataAccess]: sinon.SinonStubbedInstance<DataAccess[Prop]>;
};

export class DataAccessMock implements IDataAccessMock {
  repositoryMapper: sinon.SinonStubbedInstance<ProjectMapper> = {
    createStorageIfNotExists: sinon.stub(),
    findAll: sinon.stub(),
    findOne: sinon.stub(),
    insertOrMerge: sinon.stub(),
    insert: sinon.stub(),
    replace: sinon.stub(),
    delete: sinon.stub(),
  };
  mutationTestingReportService = sinon.createStubInstance(dal.MutationTestingReportService);
  blobService = sinon.createStubInstance(dal.RealTimeMutantsBlobService);
}

export class MutationEventResponseOrchestratorMock {
  createOrGetResponseHandler = sinon.stub();
  removeResponseHandler = sinon.stub();
}
