import path from 'path';
import fs from 'fs-extra';
import { PackageJson } from 'type-fest';
import { renameHook } from './renameHook';
import { renamePackageImport } from './renamePackageImport';

migrate('yoshi-flow-bm', ({ transform, rename }, { cwd }) => {
  rename('.module.json to .application.json', '.module.json', () => {
    return { fileName: `.application.json` };
  });

  // This must be before any other codemods that relay on yoshi-flow-bm
  transform(
    'replace imports from yoshi-flow-bm-runtime to yoshi-flow-bm',
    ['**/*.ts', '**/*.tsx', '**/*.ts'],
    ({ source }) =>
      renamePackageImport(source, 'yoshi-flow-bm-runtime', 'yoshi-flow-bm')
  );

  // move cdn.port from configuration to env var (CDN_PORT)

  let cdnPort: string | undefined;

  transform(
    'remove cdnPort from .application.json',
    '.application.json',
    ({ source }) => {
      const config = JSON.parse(source);
      cdnPort = config?.cdn?.port;

      if (cdnPort) {
        delete config.cdn;
      }

      return config;
    }
  );

  if (cdnPort) {
    fs.ensureFileSync(path.join(cwd, '.env'));

    transform('add CDN_PORT to .env', '.env', ({ source }) => {
      return source + `\nCDN_PORT=${cdnPort}`;
    });
  }

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

  transform(
    'appDefId to .appDefinitionId',
    '.application.json',
    ({ source }) => {
      const config = JSON.parse(source);

      config.appDefinitionId = config.appDefId;
      delete config.appDefId;

      return config;
    }
  );

  transform(
    'useBILogger -> useBi',
    ['**/*.ts', '**/*.tsx', '**/*.ts'],
    ({ source }) => {
      return renameHook(source, 'useBILogger', 'useBi');
    }
  );
});
