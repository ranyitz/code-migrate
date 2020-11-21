migrate('yoshi-bm-flow', ({ transform, rename }) => {
  // This must be first because other migration steps relay on application.json
  rename('module.json to application.json');

  // This must be before any other codemods that relay on yoshi-flow-bm
  transform('replace imports from yoshi-flow-bm-runtime to yoshi-flow-bm');

  transform('move cdnPort from configuration to env var (CDN_PORT)');
  transform('yoshi-bm bin to yoshi-flow-bm');

  rename('appDefId to appDefinitionId');
  rename('useBILogger to useBi');

  // TODO: exec('npm run lint --fix');
  // TODO: warn('legacyBundle is not supported');
});

migrate('yoshi-editor-flow', ({ transform }) => {
  transform(
    'replace imports from yoshi-editor-flow-runtime to yoshi-editor-flow'
  );
  transform('change translation configuration to opt out');
  transform('change experiments configuration to allow multiple scopes');
  transform('Move viewer_url and editor_url from dev/sites to env vars');
  transform('Update flowAPI environment methods');
});
