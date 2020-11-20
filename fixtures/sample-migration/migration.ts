// import { createMigration } from '../../';
// import path from 'path';
// import { create, remove } from 'lodash';
// import { rename } from 'fs';

// const runMigration = createMigration(
//   {
//     cwd: path.join(__dirname, '../sample-project'),
//   },
//   (registerTasks) => {
//     registerTasks.create();
//     // task('Update the version of foo', 'package.json', ({ source }) => {
//     //   const pkg = JSON.parse(source);
//     //   pkg.dependencies.baz = '2.0.0';
//     //   // throw new Error('faols!');
//     //   return { source };
//     //   // return { source: JSON.stringify(pkg, null, 2) };
//     // });
//   }
// );

// runMigration();

migration('this is', ({ create, transform, rename, remove }) => {
  create('');
  transform('');
  rename('');
  remove('');
});
