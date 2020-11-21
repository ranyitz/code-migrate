import path from 'path';
import tempy from 'tempy';
import fs from 'fs-extra';
import globby from 'globby';
import expect from 'expect';
import { Migration } from '../';
import { loadUserMigrationFile } from '../src/loadUserMigrationFile';

type MigrationTestkit = {
  run: () => void;
};
/**
 *
 * @param options.fixtures an absolute path to a fixtures directory
 * which contains \_\_before__ and \_\_after__ directories
 * @param options.migrationFile an absolute path to a migration file or a relative path
 * to the fixtures directory, defaults to migration.ts
 *
 */
export const createTestkit = ({
  fixtures,
  migrationFile = 'migration.ts',
}: {
  fixtures: string;
  migrationFile?: string;
}): MigrationTestkit => {
  if (!fs.existsSync(fixtures)) {
    throw new Error(`fixture path ${fixtures} doesn't exist`);
  }

  const workingDir = tempy.directory();
  const migration = Migration.create({ cwd: workingDir });

  const beforeDirectory = path.join(fixtures, '__before__');
  const afterDirectory = path.join(fixtures, '__after__');

  if (!fs.existsSync(beforeDirectory)) {
    throw new Error(`please create a "__before__" directory in ${fixtures}`);
  }

  if (!fs.existsSync(afterDirectory)) {
    throw new Error(
      `please create a "__after__" directory in ${afterDirectory}`
    );
  }

  return {
    run: () => {
      fs.copySync(beforeDirectory, workingDir);

      // join with fixtures directory in case of a relative path
      if (!migrationFile || !path.isAbsolute(migrationFile)) {
        migrationFile = path.join(fixtures, migrationFile);
      }

      loadUserMigrationFile(migration, migrationFile);

      migration.run();

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
    },
  };
};
