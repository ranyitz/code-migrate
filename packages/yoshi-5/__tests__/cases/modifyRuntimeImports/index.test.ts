import path from 'path';
import { createTestkit } from '../../../../migratejs/__tests__/createTestkit';
import { migrationFile } from '../../utils';

const testkit = createTestkit({
  migrationFile,
});

test('yoshi-flow-bm-runtime -> yoshi-flow-bm cjs', () => {
  testkit.run({ fixtures: path.join(__dirname, 'cjs') });
});

test('yoshi-flow-bm-runtime -> yoshi-flow-bm esm', () => {
  testkit.run({ fixtures: path.join(__dirname, 'esm') });
});