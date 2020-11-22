import path from 'path';

migrate('renmae', ({ rename }) => {
  rename('transform foo.json to foo-bar.json', 'foo.json', ({ fileName }) => {
    return `${path.basename(fileName, '.json')}-bar.json`;
  });
});
