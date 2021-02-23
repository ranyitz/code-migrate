import { migrate } from 'code-migrate';

migrate('error', ({ transform }) => {
  transform('transform bar to baz in json contents', '*.json', ({ source }) => {
    let a: string;

    a = 'hello';
    return JSON.parse(source);
  });
});
