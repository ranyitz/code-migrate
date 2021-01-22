import path from 'path';
import { migrate } from 'code-migrate';

migrate('rename', ({ rename }) => {
  rename('transform foo.json to foo-bar.json', 'foo.json', ({ fileName }) => {
    return `${path.basename(fileName, '.json')}-bar.json`;
  });
});
