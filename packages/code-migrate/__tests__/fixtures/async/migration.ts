import path from 'path';
import { migrate } from 'code-migrate';

migrate('transform', async ({ transform }) => {
  await new Promise((r) => setTimeout(r, 0));

  transform(
    'transform bar to baz in json contents',
    '*.json',
    ({ fileName, source }) => {
      return source.replace('bar', path.basename(fileName, '.json'));
    }
  );
});
