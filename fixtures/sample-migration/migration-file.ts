migrate('change bar to foo', ({ rename, transform, create, remove }) => {
  create('baz.txt', () => {
    return { fileName: 'src/baz.txt', source: 'baz' };
  });

  remove('remove foo.ts', 'src/foo.ts');

  transform('change project name', 'package.json', ({ source }) => {
    return {
      fileName: 'package.json',
      source: source.replace('sample-project', 'cool-project'),
    };
  });

  rename('bar.json to foo.json', '**/bar.json', ({ fileName }) => {
    return { fileName: fileName.replace('bar', 'foo') };
  });
});
