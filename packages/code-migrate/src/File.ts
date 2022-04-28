import path from 'path';
import { Stats } from 'fs-extra';
import { Pattern } from './types';
import globby from 'globby';
import { isUndefined } from 'lodash';
import { Migration } from './Migration';

export class File {
  cwd: string;
  fileName: string;
  migration: Migration;
  _source: string | undefined;
  _stats: Stats | null | undefined;

  constructor({
    cwd,
    fileName,
    source,
    migration,
  }: {
    cwd: string;
    fileName: string;
    source?: string;
    migration: Migration;
  }) {
    this.cwd = cwd;
    this.fileName = fileName;
    this._source = source;
    this._stats = undefined;
    this.migration = migration;
  }

  get path(): string {
    // TODO: support ablsolute paths as well
    return path.join(this.cwd, this.fileName);
  }

  get stats() {
    if (!this._stats) {
      try {
        this._stats = this.migration.fs.lstatSync(this.path);
      } catch (err) {
        this._stats = null;
      }
    }

    return this._stats;
  }

  get exists() {
    // this.stats is null in case the file isn't exists
    return !!this.stats;
  }

  get isDirectory() {
    return !!this.stats?.isDirectory();
  }

  get source(): string {
    if (isUndefined(this._source)) {
      this._source = this.migration.fs.readFileSync(this.path);
    }

    return this._source;
  }
}

export const getFiles = (
  cwd: string,
  pattern: Pattern,
  migration: Migration
): Array<File> => {
  const fileNames = globby.sync(pattern, {
    cwd,
    gitignore: true,
    ignore: ['**/node_modules/**', '**/.git/**'],
    dot: true,
    // @ts-expect-error
    fs: migration.fs.fileSystemAdapterMethods,
  });

  if (!fileNames) {
    return [];
  }

  const files: Array<File> = fileNames.map((fileName: string) => {
    return new File({ cwd, fileName, migration });
  });

  return files;
};
