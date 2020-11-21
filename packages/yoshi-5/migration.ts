import fs from 'fs-extra';
import { PackageJson } from 'type-fest';
import { renameHook } from './renameHook';
import { renamePackageImport } from './renamePackageImport';

migrate('yoshi-flow-bm', ({ transform, rename }) => {
  // This must be first because other migration steps relay on application.json
  rename('module.json to application.json', 'module.json', () => {
    return { fileName: `application.json` };
  });

  // This must be before any other codemods that relay on yoshi-flow-bm
  transform(
    'replace imports from yoshi-flow-bm-runtime to yoshi-flow-bm',
    ['**/*.ts', '**/*.tsx', '**/*.ts'],
    ({ source }) =>
      renamePackageImport(source, 'yoshi-flow-bm-runtime', 'yoshi-flow-bm')
  );

  // TODO - add a way to create scopes for a single logical task
  // scope('move cdnPort from configuration to env var (CDN_PORT)', () => {
  let cdnPort: string | undefined;

  // TODO - consider adding a `read` task for case the user
  // only wants to retrieve information

  transform(
    'remove cdnPort from application.json',
    'application.json',
    ({ source }) => {
      const config = JSON.parse(source);
      cdnPort = config.cdnPort;
      delete config.cdnPort;

      return config;
    }
  );

  if (cdnPort) {
    // TODO - consider having ensure method
    fs.ensureFileSync('.env');

    transform('add CDN_PORT to .env', '.env', ({ source }) => {
      return source + `\nCDN_PORT=${cdnPort}`;
    });
  }
  // });

  transform('yoshi-bm bin to yoshi-flow-bm', 'package.json', ({ source }) => {
    const config: PackageJson = JSON.parse(source);

    if (!config.scripts) {
      return source;
    }

    for (const [key, value] of Object.entries(config.scripts)) {
      config.scripts[key] = value.replace('yoshi-bm', 'yoshi-flow-bm');
    }

    return config;
  });

  transform('appDefId to appDefinitionId', 'application.json', ({ source }) => {
    const config = JSON.parse(source);
    config.appDefinitionId = config.appDefId;
    delete config.appDefId;

    return config;
  });

  transform(
    'useBILogger -> useBi',
    ['**/*.ts', '**/*.tsx', '**/*.ts'],
    ({ source }) => {
      return renameHook(source, 'useBILogger', 'useBi');
    }
  );

  // TODO: exec('npm run lint --fix');
  // TODO: warn('legacyBundle is not supported');
});

// migrate('yoshi-editor-flow', ({ transform }) => {
//   transform(
//     'replace imports from yoshi-editor-flow-runtime to yoshi-editor-flow'
//   );
//   transform('change translation configuration to opt out');
//   transform('change experiments configuration to allow multiple scopes');
//   transform('Move viewer_url and editor_url from dev/sites to env vars');
//   transform('Update flowAPI environment methods');
// });
