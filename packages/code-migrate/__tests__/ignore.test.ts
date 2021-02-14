import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

createTestkit().test({
  fixtures: resolveFixture('ignore'),
  title: 'ignore node_modules & .git directories',
});
