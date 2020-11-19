import { createMigration } from '../../';
import path from 'path';

const runMigration = createMigration(
  {
    cwd: path.join(__dirname, '../sample-project'),
  },
  (task) => {
    task('Update the version of foo', 'package.json', ({ source }) => {
      const pkg = JSON.parse(source);
      pkg.dependencies.baz = '2.0.0';
      // throw new Error('faols!');
      return { source };
      // return { source: JSON.stringify(pkg, null, 2) };
    });
  }
);

runMigration();
