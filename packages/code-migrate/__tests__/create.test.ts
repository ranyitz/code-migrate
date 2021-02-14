import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

createTestkit().test({
  fixtures: resolveFixture('create'),
});
