import { createMigration } from '../../';
import path from 'path';

const runMigration = createMigration(
  {
    cwd: path.join(__dirname, '../sample-project'),
  },
  (task) => {
    task('update the version of foo', 'package.json', ({ source }) => {
      const pkg = JSON.parse(source);
      pkg.dependencies.baz = '2.0.0';
      return { source };
      // return { source: JSON.stringify(pkg, null, 2) };
    });
  }
);

runMigration();
