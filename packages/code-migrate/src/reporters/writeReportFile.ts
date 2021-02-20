import path from 'path';
import fs from 'fs-extra';
import { Migration } from '../Migration';
import { createMarkdownReport } from './createMarkdownReport';
import { magenta } from 'chalk';

export const writeReportFile = (migration: Migration, reportFile: string) => {
  const absoluteReportFile = path.isAbsolute(reportFile)
    ? reportFile
    : path.join(process.cwd(), reportFile);

  fs.outputFileSync(absoluteReportFile, createMarkdownReport(migration));
  console.log();
  console.log(`Markdown report was written to ${magenta(absoluteReportFile)}`);
};
