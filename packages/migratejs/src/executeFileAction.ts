import { FileAction } from './types';
import fs from 'fs-extra';

export function executeFileAction(fileAction: FileAction) {
  switch (fileAction.type) {
    case 'transform': {
      const { originalFile, newFile } = fileAction;
      fs.removeSync(originalFile.path);
      fs.writeFileSync(newFile.path, newFile.source);
      break;
    }

    case 'create': {
      const { newFile } = fileAction;
      fs.writeFileSync(newFile.path, newFile.source);
      break;
    }

    case 'remove': {
      fs.removeSync(fileAction.file.path);
      break;
    }

    case 'rename': {
      const { originalFile, newFile } = fileAction;
      fs.renameSync(originalFile.path, newFile.path);
      break;
    }

    default: {
      // @ts-expect-error ts thinks that task is "never"
      throw new Error(`unknown fileAction type "${fileAction.type}"`);
    }
  }
}
