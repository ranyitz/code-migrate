import { migrate } from 'code-migrate';

migrate('remove', ({ remove }) => {
  remove('remove json files', '*.json');
});
