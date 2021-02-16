import { createCli } from './createCli';

createCli({
  binName: 'migrate',
  version: require('../package.json').version,
});
