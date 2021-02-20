import { createCli } from './createCli';

createCli({
  binName: 'code-migrate',
  version: require('../../package.json').version,
});
