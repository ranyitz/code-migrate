import path from 'path';

migrate('transform', ({ transform }) => {
  transform(
    'transform bar to baz in json contents',
    '*.json',
    ({ fileName, source }) => {
      return source.replace('bar', path.basename(fileName, '.json'));
    }
  );
});
