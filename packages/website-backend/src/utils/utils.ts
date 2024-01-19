import { v4 as uuidV4 } from 'uuid';
import { sha512_256 } from 'js-sha512';
import fetch from 'node-fetch';
import { InvalidSlugError, Slug } from '@stryker-mutator/dashboard-common';
import { NotFoundException } from '@nestjs/common';

export function parseSlug(slug: string) {
  try {
    return Slug.parse(slug);
  } catch (error) {
    if (error instanceof InvalidSlugError) {
      throw new NotFoundException(`Report "${slug}" does not exist`);
    } else {
      throw error;
    }
  }
}

export default {
  env(key: string) {
    return process.env[key];
  },

  requiredEnvVar(name: string): string {
    const value = this.env(name);
    if (!value) {
      throw new Error(`Environment variable ${name} not set.`);
    } else {
      return value;
    }
  },

  optionalEnvVar(name: string, defaultValue: string): string {
    const value = this.env(name);
    return !value ? defaultValue : value;
  },

  generateApiKey(): string {
    return uuidV4();
  },

  generateHashValue(value: string): string {
    return sha512_256(value);
  },

  fetch,
};
