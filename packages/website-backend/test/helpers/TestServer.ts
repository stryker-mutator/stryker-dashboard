import * as dal from '@stryker-mutator/dashboard-data-access';
import * as github from '../../src/github/models.js';
import jwt from 'jsonwebtoken';
import Configuration from '../../src/services/Configuration.js';
import DataAccess from '../../src/services/DataAccess.js';
import sinon from 'sinon';
import { ProjectMapper } from '@stryker-mutator/dashboard-data-access';

export function createToken(user: github.Authentication): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      user,
      config.jwtSecret,
      {
        algorithm: 'HS512',
        audience: 'stryker',
        expiresIn: '30m',
        issuer: 'stryker',
      },
      (err, encoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(encoded!);
        }
      }
    );
  });
}

export async function createAuthorizationHeader(user: github.Authentication) {
  const token = await createToken(user);
  return `Bearer ${token}`;
}

export const config: Configuration = {
  githubClientId: 'githubClientId',
  githubSecret: 'githubSecret',
  baseUrl: 'baseUrl',
  jwtSecret: 'jwtSecret',
  isDevelopment: true,
  cors: '*',
};

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
  };
  mutationTestingReportService = sinon.createStubInstance(
    dal.MutationTestingReportService
  );
  blobService = sinon.createStubInstance(dal.RealTimeMutantsBlobService);
}

export class MutationEventResponseOrchestratorMock {
  createOrGetResponseHandler = sinon.stub();
  removeResponseHandler = sinon.stub();
}
