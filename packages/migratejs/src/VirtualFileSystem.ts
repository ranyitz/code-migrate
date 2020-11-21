import fs, { BigIntOptions, Dirent, PathLike, Stats } from 'fs-extra';
import pathModule from 'path';
import { FileSystemAdapter } from 'fast-glob';

type FileInformation = {
  data?: string;
  stats?: Stats;
  action: 'remove' | 'write' | 'none';
};

export class VirtualFileSystem implements FileSystemAdapter {
  cwd: string;
  map: Map<string, FileInformation>;

  constructor({ cwd }: { cwd: string }) {
    this.cwd = cwd;
    this.map = new Map();
  }

  private getFile(path: string): FileInformation {
    if (!this.map.has(path)) {
      this.map.set(path, { action: 'none' });
    }

    return this.map.get(path)!;
  }

  // @ts-ignore
  statSync(path: PathLike, options: BigIntOptions): Stats {
    if (options) {
      throw new Error('need to implenent bigIntOptions');
    }

    path = path.toString();

    if (!this.map.has(path)) {
      this.map.set(path, { action: 'none' });
    }

    const file = this.getFile(path)!;

    if (!file.stats) {
      const stats = fs.statSync(path);
      this.map.set(path, { ...file, stats });
    }

    return this.getFile(path).stats!;
  }

  // @ts-expect-error
  readdir() {
    throw new Error('dfsdf');
  }

  // @ts-expect-error - options type is too big
  readdirSync(path: PathLike, options: any): Array<Dirent | DirentLike> {
    const files = fs.readdirSync(path, options);

    const writtenFilePaths = this.getWrittenFilePaths()
      .filter((p) => pathModule.dirname(p) === path)
      .map((p) => new DirentLike(p));

    const removedFilePaths = this.getRemovedFilePaths().filter(
      (p) => pathModule.dirname(p) === path
    );

    const allFilePaths = [...files, ...writtenFilePaths];

    // @ts-expect-error
    const all = allFilePaths.filter((p) => !removedFilePaths.includes(p.name));
    // @ts-expect-error
    return all;
  }

  getWrittenFilePaths() {
    const written: Array<string> = [];

    this.map.forEach((fileInformation, path) => {
      if (fileInformation.action === 'write') {
        written.push(path);
      }
    });

    return written;
  }
  getRemovedFilePaths() {
    const removed: Array<string> = [];

    this.map.forEach((fileInformation, path) => {
      if (fileInformation.action === 'remove') {
        removed.push(path);
      }
    });

    return removed;
  }
  writeFileSync(path: string, data: string): void {
    const file = this.getFile(path);
    file.data = data;
    file.action = 'write';
  }

  removeSync(path: string): void {
    const file = this.getFile(path);
    file.action = 'remove';
  }

  lstatSync(path: PathLike): Stats {
    path = path.toString();

    if (!this.map.has(path)) {
      this.map.set(path, { action: 'none' });
    }

    const file = this.getFile(path)!;

    if (!file.stats) {
      const stats = fs.lstatSync(path);
      this.map.set(path, { ...file, stats });
    }

    return this.getFile(path).stats!;
  }

  readFileSync(path: string): string {
    const file = this.getFile(path);

    if (file.action === 'remove') {
      // We'll might need to deal with that later,
      // because globby can read file that was deleted
      throw new Error('cannot read a file which is removed');
    }

    if (!file.data) {
      const data = fs.readFileSync(path, 'utf-8');
      this.map.set(path, { ...file, data });
    }

    return this.getFile(path).data!;
  }

  renameSync(oldPath: string, newPath: string): void {
    const oldFile = this.getFile(oldPath);
    const oldFileData = this.readFileSync(oldPath);
    const oldFileStats = this.lstatSync(oldPath);
    oldFile.action = 'remove';

    const newFile = this.getFile(newPath);
    newFile.data = oldFileData;
    newFile.stats = oldFileStats;
    newFile.action = 'write';
  }

  writeChangesToDisc() {
    this.map.forEach((fileInformation, path) => {
      if (fileInformation.action === 'write') {
        fs.writeFileSync(path, fileInformation.data!);
      } else if (fileInformation.action === 'remove') {
        fs.removeSync(path);
      }
    });
  }

  fileSystemAdapterMethods = {
    readdirSync: this.readdirSync.bind(this),
    lstatSync: this.lstatSync.bind(this),
    statSync: this.statSync.bind(this),
  };
}

class DirentLike implements Dirent {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  isFile = (): boolean => {
    return false;
  };
  isDirectory = (): boolean => {
    return true;
  };
  isBlockDevice = (): boolean => {
    return false;
  };
  isCharacterDevice = (): boolean => {
    return false;
  };
  isSymbolicLink = (): boolean => {
    return false;
  };
  isFIFO = (): boolean => {
    return false;
  };
  isSocket = (): boolean => {
    return false;
  };
}
