import { migrate } from 'code-migrate';

migrate('create', ({ create }) => {
  create(
    'create another file with added an bar',
    '*.json',
    ({ fileName, source }) => {
      return {
        fileName: fileName.replace('foo', 'foo-bar'),
        source: source.replace('bar', 'bar-bar'),
      };
    }
  );

  create('create bar.txt', () => {
    return {
      fileName: 'bar.txt',
      source: 'baz\n',
    };
  });
});
