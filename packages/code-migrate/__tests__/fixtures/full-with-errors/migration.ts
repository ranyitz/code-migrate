// migration.ts
import { migrate } from 'code-migrate';

migrate(
  'automatic migration for my library',
  ({ transform, rename, create, remove }) => {
    transform(
      'add the build directory to .gitignore',
      '.gitignore',
      ({ source }) => source.trim() + '\nbuild\n'
    );

    transform(
      'remove "use strict"; from all .js files',
      '**/*.js',
      ({ source }) => {
        return source.replace(/("|')use strict("|');?/, '').trimStart();
      }
    );

    remove('remove babel config', 'babel.config.js');

    rename('rename the main config to cool config', 'main-config.json', () => {
      return 'cool-config.json';
    });

    transform('parse config and fail', 'cool-config.json', ({ source }) => {
      return JSON.parse(source);
    });

    create('create an .env file', () => {
      return {
        fileName: '.env',
        source: 'HELLO=WORLD\n',
      };
    });
  }
);
