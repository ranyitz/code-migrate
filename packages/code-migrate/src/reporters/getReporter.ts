import type { Reporter } from './';
import { defaultReporter, quietReporter, markdownReporter } from './';
import path from 'path';

const reporters: Record<string, Reporter> = {
  default: defaultReporter,
  quiet: quietReporter,
  markdown: markdownReporter,
};

export const getReporter = (
  reporterName: string | undefined = 'default',
  { cwd }: { cwd: string }
) => {
  if (reporterName in reporters) {
    return reporters[reporterName];
  } else {
    const reporterPath = path.isAbsolute(reporterName)
      ? reporterName
      : path.resolve(cwd, reporterName);

    return require(reporterPath);
  }
};
