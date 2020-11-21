import * as recast from 'recast';
import { namedTypes as n, builders as b } from 'ast-types';
import type { NodePath } from 'ast-types/lib/node-path';

export const renameHook = (
  source: string,
  before: string,
  after: string
): string => {
  const ast = recast.parse(source, {
    parser: require('./parser'),
  });

  let importedBiLogger = false;

  recast.visit(ast, {
    visitCallExpression: (path) => {
      if (path.get('callee').value.name !== 'require') {
        return false;
      }

      if (!n.ObjectPattern.check(path.parent.get('id').value)) {
        return false;
      }

      path.parent.get('id', 'properties')?.map((property: NodePath<any>) => {
        if (property.get('value').value.name === before) {
          importedBiLogger = true;
          property.replace(b.identifier(after));
        }
      });

      return false;
    },
    visitImportDeclaration: (path) => {
      path.get('specifiers').map((specifier: NodePath<any>) => {
        const imported = specifier.get('imported');

        if (imported?.value?.name === before) {
          importedBiLogger = true;
          imported.replace(b.identifier(after));
        }
      });

      return false;
    },
  });

  if (importedBiLogger) {
    recast.visit(ast, {
      visitCallExpression: (path) => {
        const callee = path.get('callee');

        if (callee.value.name === before) {
          callee.replace(b.identifier(after));
        }

        return false;
      },
    });
  }

  return recast.print(ast, { quote: 'single' }).code;
};
