import path from 'path';
import fs from 'fs-extra';
import { Migration } from '../Migration';
import { createMarkdownReport } from './createMarkdownReport';

export const writeReportFile = (migration: Migration, reportFile: string) => {
  const absoluteReportFile = path.isAbsolute(reportFile)
    ? reportFile
    : path.join(process.cwd(), reportFile);

  fs.outputFileSync(absoluteReportFile, createMarkdownReport(migration));
  console.log(`Markdown report was written to ${absoluteReportFile}`);
};
