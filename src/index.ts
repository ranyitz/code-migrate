type Pattern = string;

type Transform = ({ fileName, source }: { fileName: string, source: string }) => {}

type RegisterTask = (taskName: string, pattern: Pattern, transformFn: Transform) => void

type Migration = (registerTask: RegisterTask) => void

type RunMigration = () => void;

type Options = { cwd: string };

type CreateMigration = (options: Options, migration: Migration) => RunMigration

type Task = { name: string, pattern: Pattern, transformFn: Transform };

import globby from 'globby';

export const createMigration: CreateMigration = (options, migration) => {
    const tasks: Array<Task> = [];

    const registerTask: RegisterTask = (name, pattern, transformFn) => {
        tasks.push({ name, pattern, transformFn });
    };

    migration(registerTask);

    console.log({ tasks, options });

    return () => {
        tasks.forEach(task => runTask(task, options));
    };
};

function runTask(task: Task, options: Options) {
    const files = globby.sync(task.pattern, { cwd: options.cwd });

    if (!files) {
        throw new Error('couldn');
    }
}