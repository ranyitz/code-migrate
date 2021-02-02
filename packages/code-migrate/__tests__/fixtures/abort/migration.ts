import path from 'path';
import { migrate } from 'code-migrate';

migrate('abort', ({ transform }) => {
  transform(
    'transform bar to baz in json contents',
    'baz.json',
    ({ fileName, source }) => {
      return source.replace('bar', path.basename(fileName, '.json'));
    }
  );

  transform(
    'transform world to there in foo.json',
    '*.json',
    ({ source, abort }) => {
      // since ono of the files contain this
      // we expect all of the transformation to be aborted
      if (source.includes('foo')) {
        abort();
      }

      return source.replace('world', 'there');
    }
  );
});
