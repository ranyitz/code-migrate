import { migrate } from 'code-migrate';

migrate('error', ({ transform }) => {
  transform('transform bar to baz in json contents', '*.json', ({ source }) => {
    return JSON.parse(source);
  });
});
