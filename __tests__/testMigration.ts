import path from 'path';
import tempy from 'tempy';
import fs from 'fs-extra';
import globby from 'globby';
import expect from 'expect';
import { createMigration, RegisterMigration } from '../';

export const testMigration = ({
  registerMigration,
  fixtures,
}: {
  registerMigration: RegisterMigration;
  fixtures: string;
}): void => {
  if (!fs.existsSync(fixtures)) {
    throw new Error(`fixture path ${fixtures} doesn't exist`);
  }

  const workingDir = tempy.directory();
  const beforeDirectory = path.join(fixtures, 'before');
  const afterDirectory = path.join(fixtures, 'after');

  if (!fs.existsSync(beforeDirectory)) {
    throw new Error(`please create a "before" directory in ${fixtures}`);
  }

  if (!fs.existsSync(afterDirectory)) {
    throw new Error(`please create a "after" directory in ${afterDirectory}`);
  }

  fs.copySync(beforeDirectory, workingDir);

  const runMigration = createMigration({ cwd: workingDir }, registerMigration);

  runMigration();

  const expectedFiles = globby.sync('**/*', {
    cwd: afterDirectory,
    gitignore: true,
  });

  const resultFiles = globby.sync('**/*', {
    cwd: workingDir,
    gitignore: true,
  });

  expectedFiles.forEach((fileName) => {
    expect(resultFiles).toContain(fileName);

    const expectedFilePath = path.join(afterDirectory, fileName);
    const expectedFileContents = fs.readFileSync(expectedFilePath, 'utf-8');
    const resultFilePath = path.join(workingDir, fileName);
    const resultFileContents = fs.readFileSync(resultFilePath, 'utf-8');

    expect(expectedFileContents).toBe(resultFileContents);
  });
};
