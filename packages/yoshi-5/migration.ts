import fs from 'fs-extra';
import os from 'os';

const strigifyJson = (object: Record<string, any>) =>
  JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL;

migrate('yoshi-bm-flow', ({ transform, rename }) => {
  // This must be first because other migration steps relay on application.json
  rename('module.json to application.json', 'module.json', () => {
    return { fileName: `application.json` };
  });

  // This must be before any other codemods that relay on yoshi-flow-bm
  // transform('replace imports from yoshi-flow-bm-runtime to yoshi-flow-bm');

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

      return { source: strigifyJson(config) };
    }
  );

  if (cdnPort) {
    // TODO - consider having ensure method
    fs.ensureFileSync('.env');

    transform('add CDN_PORT to .env', '.env', ({ source }) => {
      source = source + `\nCDN_PORT=${cdnPort}`;
      return { source };
    });
  }
  // });

  // transform('yoshi-bm bin to yoshi-flow-bm');

  // rename('appDefId to appDefinitionId');
  // rename('useBILogger to useBi');

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
