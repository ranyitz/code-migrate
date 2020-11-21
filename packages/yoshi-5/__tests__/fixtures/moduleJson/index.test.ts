import { createTestkit } from '../../../../migratejs/__tests__/createTestkit';

const testkit = createTestkit({ fixtures: __dirname });

test('change module.json to application.json', () => {
  testkit.run(({ rename }) => {});
});
