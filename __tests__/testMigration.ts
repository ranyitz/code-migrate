import path from 'path';
import { Migration } from '../';
import tempy from 'tempy';
import fs from 'fs-extra';
import { createMigration } from '../';
import globby from 'globby';
import expect from 'expect';

export const testMigration = ({
  migration,
  fixtures,
}: {
  migration: Migration;
  fixtures: string;
}): void => {
  const workingDir = tempy.directory();
  const beforeDirectory = path.join(fixtures, 'before');
  const afterDirectory = path.join(fixtures, 'after');

  fs.copySync(beforeDirectory, workingDir);

  const runMigration = createMigration({ cwd: workingDir }, migration);

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
