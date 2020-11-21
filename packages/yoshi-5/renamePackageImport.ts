import * as recast from 'recast';
import { builders as b } from 'ast-types';

export const renamePackageImport = (
  source: string,
  before: string,
  after: string
) => {
  const ast = recast.parse(source, {
    parser: require('./parser'),
  });

  recast.visit(ast, {
    visitCallExpression: (path) => {
      if (path.get('callee').value.name !== 'require') {
        return false;
      }

      const argument = path.get('arguments', 0, 'value');

      if (argument.value === before) {
        argument.replace(after);
      }

      return false;
    },
    visitImportDeclaration: (path) => {
      const source = path.get('source');

      if (source.get('value').value === before) {
        source.replace(b.literal(after));
      }

      return false;
    },
  });

  return recast.print(ast, { quote: 'single' }).code;
};
