import { TaskError, TaskResult } from '../types';
import { groupBy, isEmpty } from 'lodash';
import { Migration } from '../Migration';

export const formatSingleTaskResult = (taskResult: TaskResult) => {
  switch (taskResult.type) {
    case 'transform': {
      return taskResult.newFile.fileName;
    }

    case 'create': {
      return taskResult.newFile.fileName;
    }

    case 'remove': {
      return taskResult.file.fileName;
    }

    case 'rename': {
      const { originalFile, newFile } = taskResult;
      return `${originalFile.fileName} -> ${newFile.fileName}`;
    }

    default: {
      // @ts-expect-error ts thinks that task is "never"
      throw new Error(`unknown taskResult type "${taskResult.type}"`);
    }
  }
};

export const formatSingleTaskError = (taskError: TaskError) => {
  return `**ERROR** \`${taskError.file?.fileName}\`
\`\`\`
${taskError.error.stack}
\`\`\``;
};

export const createMarkdownReport = (migration: Migration) => {
  const output = [];

  output.push(`## ${migration.title}
> ${migration.options.cwd}`);

  for (const [taskTitle, taskResults] of Object.entries(
    groupBy(migration.results, 'task.title')
  )) {
    output.push(
      `#### ${taskTitle}` +
        '\n' +
        '```\n' +
        taskResults.map(formatSingleTaskResult).join('\n') +
        '\n```'
    );
  }

  if (migration.errors.length > 0) {
    output.push('### ⚠️  ' + `The following migration tasks were failed`);

    for (const [taskTitle, taskErrors] of Object.entries(
      groupBy(migration.errors, 'task.title')
    )) {
      output.push(
        `#### ${taskTitle}` +
          '\n' +
          taskErrors.map(formatSingleTaskError).join('\n')
      );
    }
  }

  if (isEmpty(migration.results)) {
    output.push('**🤷‍ No changes have been made**');
  }

  return output.join('\n\n');
};
