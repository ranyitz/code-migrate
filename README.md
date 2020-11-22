# 🧃 Code Migrate
A framework for writing codebase migrations on JavaScript/Node based projects.

## The problems
Writing automatic migration on big codebases usually takes time. In order to write a good migration script you need to take care of many concerns like interacting with the user, write a CLI, have proper testing and more.

This usually results in giving up on adding an automatic migration and instead, just providing a migration guide. If you're maintaining a library or a toolkit, you'd want to provide automatic migration between major versions, especially for those semantic API changes.

## Features

* The migration is separated into two parts, the first one is to process all of the tasks and the second is writing them to the file-system. This ensures that in case of an error, nothing will be written to the file-system. It also lets the user to approve the migration via prompt from the CLI.

* Even though nothing written on the first part, all fs operation are written the a virtual file system which make sure that tasks that dependent on each other will work as expected.

* Code Migrate creates a beautiful report of the changes sorted by tasks.

* There is a testkit that helps with the process of writing the migration. You can define your `__before__` and `__after__` directories and use TDD in order to implement the migration.

## CLI
```
  Usage
    $ migrate <path/to/migration.ts>

  Options
    --version, -v   Version number
    --help, -h      Displays this message
    --dry, -d       Dry-run mode, does not modify files
    --yes, -y       Skip all confirmation prompts. Useful in CI to automatically answer the confirmation prompt
    --cwd           Runs the migration on this directory [defaults to process.cwd()]
```

## Writing a migration

```ts
migrate(
  'automatic migration for my library',
  ({ transform, rename, create, remove }) => {
    transform(
      'replace foo with bar in all ts files',
      '**/*.ts',
      ({ source }) => {
        return source.replace('foo', 'bar');
      }
    );

    remove('remove babel config', 'babel.config.js');

    rename('rename the main config to cool config', 'main-config.json', () => {
      return 'cool-config.json';
    });

    create('create an .env file', () => {
      return {
        fileName: '.env',
        source: 'HELLO=WORLD',
      };
    });
  }
);
```

## API

### migrate
Similarly to the way test runners work, Code Migrate will expose a global migrate function. Us it to define your migration.

```ts
type Migrate = (
  title: string,
  fn: (
    tasks: {
      transform: Transform,
      rename: Rename,
      remove: Remove,
      create: Create
    },
    options: { cwd: string, fs: VirtualFileSystem }
  ) => void
) => void;

```
### tasks
migration is a series of tasks from the follwing list

#### transform
Change the source code of a file or multiple files

```ts
type Transform = (
  title: string,
  pattern: Pattern,
  transformFn: TransformFn
) => void;

type TransformFn = ({
  fileName: string;
  source: string;
}) => string | SerializeableJsonObject;
```

#### rename
Change the name of a file/directory or multiple files/directories

```ts
type Rename = (
  title: string,
  pattern: Pattern,
  renameFn: RenameFn
) => void;

type RenameFn = ({ fileName: string }) => string;
```
#### remove
Delete a file/directory or multiple files/directories
```ts
type Remove = (title: string, pattern: Pattern) => void;

```
#### create
Create a new file/directory or multiple files/directories
```ts

type Create = (
  title: string,
  patternOrCreateFn: EmptyCreateFn | Pattern,
  createFn?: CreateFn
) => void;
```
### Future plans and ideas
* `exec` task (run custom commands)
* improve testsing
* `warn`/`check` task
* code-migrate-tools (support AST related operations)
* consider adding a `read` task for case the user only wants to retrieve information
* add a way to create scopes for a single logical task

