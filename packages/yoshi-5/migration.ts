import fs from 'fs-extra';
import os from 'os';
import { PackageJson } from 'type-fest';
import * as recast from 'recast';
import { namedTypes as n, builders as b } from 'ast-types';
import type { NodePath } from 'ast-types/lib/node-path';

const strigifyJson = (object: Record<string, any>) =>
  JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL;

migrate('yoshi-flow-bm', ({ transform, rename }) => {
  // This must be first because other migration steps relay on application.json
  rename('module.json to application.json', 'module.json', () => {
    return { fileName: `application.json` };
  });

  // This must be before any other codemods that relay on yoshi-flow-bm
  transform(
    'replace imports from yoshi-flow-bm-runtime to yoshi-flow-bm',
    ['**/*.ts', '**/*.tsx', '**/*.ts'],
    ({ source }) => {
      const ast = recast.parse(source);

      recast.visit(ast, {
        visitCallExpression: (path) => {
          if (path.get('callee').value.name !== 'require') {
            return false;
          }

          const argument = path.get('arguments', 0, 'value');

          if (argument.value === 'yoshi-flow-bm-runtime') {
            argument.replace('yoshi-flow-bm');
          }

          return false;
        },
        visitImportDeclaration: (path) => {
          const source = path.get('source');

          if (source.get('value').value === 'yoshi-flow-bm-runtime') {
            source.replace(b.literal('yoshi-flow-bm'));
          }

          return false;
        },
      });

      return recast.print(ast, { quote: 'single' }).code;
    }
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

      return strigifyJson(config);
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

    return strigifyJson(config);
  });

  transform('appDefId to appDefinitionId', 'application.json', ({ source }) => {
    const config = JSON.parse(source);
    config.appDefinitionId = config.appDefId;
    delete config.appDefId;

    return strigifyJson(config);
  });

  // renameHook generic transform
  transform(
    'useBILogger -> useBi',
    ['**/*.ts', '**/*.tsx', '**/*.ts'],
    ({ source }) => {
      const ast = recast.parse(source);

      let importedBiLogger = false;

      recast.visit(ast, {
        visitCallExpression: (path) => {
          if (path.get('callee').value.name !== 'require') {
            return false;
          }

          path.parent.get('id', 'properties').map((property: NodePath<any>) => {
            if (property.get('value').value.name === 'useBILogger') {
              importedBiLogger = true;
              property.replace(b.identifier('useBi'));
            }
          });

          return false;
        },
        visitImportDeclaration: (path) => {
          path.get('specifiers').map((specifier: NodePath<any>) => {
            const imported = specifier.get('imported');

            if (imported.value.name === 'useBILogger') {
              importedBiLogger = true;
              imported.replace(b.identifier('useBi'));
            }
          });

          return false;
        },
      });

      if (importedBiLogger) {
        recast.visit(ast, {
          visitCallExpression: (path) => {
            const callee = path.get('callee');

            if (callee.value.name === 'useBILogger') {
              callee.replace(b.identifier('useBi'));
            }

            return false;
          },
        });
      }

      return recast.print(ast).code;
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
