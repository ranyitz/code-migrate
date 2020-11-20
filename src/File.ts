import path from 'path';
import fs, { Stats } from 'fs-extra';
import { Pattern } from './types';
import globby from 'globby';
import { isUndefined } from 'lodash';

export class File {
  cwd: string;
  fileName: string;
  _source: string | undefined;
  _stats: Stats | null | undefined;

  constructor({
    cwd,
    fileName,
    source,
  }: {
    cwd: string;
    fileName: string;
    source?: string;
  }) {
    this.cwd = cwd;
    this.fileName = fileName;
    this._source = source;
    this._stats = undefined;
  }

  get path(): string {
    // TODO: support ablsolute paths as well
    return path.join(this.cwd, this.fileName);
  }

  get stats() {
    if (!this._stats) {
      try {
        this._stats = fs.lstatSync(this.path);
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
      this._source = fs.readFileSync(this.path, 'utf-8');
    }

    return this._source;
  }
}

export const getFiles = (cwd: string, pattern: Pattern): Array<File> => {
  const fileNames = globby.sync(pattern, {
    cwd,
    gitignore: true,
  });

  if (!fileNames) {
    return [];
  }

  const files: Array<File> = fileNames.map((fileName) => {
    return new File({ cwd, fileName });
  });

  return files;
};
