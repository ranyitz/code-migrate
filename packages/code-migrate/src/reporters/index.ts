import { Migration } from '../Migration';

export * from './default-reporter';
export * from './quiet-reporter';
export * from './markdown-reporter';
export * from './getReporter';

export type Reporter = (migration: Migration) => void;
