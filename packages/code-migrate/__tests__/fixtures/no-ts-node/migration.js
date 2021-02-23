import { migrate } from 'code-migrate';

migrate('error', ({ transform }) => {
  transform('transform bar to baz in json contents', '*.json', ({ source }) => {
    let a: string;

    console.log(a);
    return JSON.parse(source);
  });
});
