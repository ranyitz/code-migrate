# Migratejs

Perform an automatic migration on a JavaScript/Node based project. The migration tool is a framework that knows how to get a set of instructions and perform the relevant migration base on them.

## The problems
Writing automatic migration is usually painfull and you need to take care of many things, resulting in just providing a migration guide while you could automate parts of the process. From an infrastructure perspective, when developing a toolkit/library there are often cases you'd like to run a script/codemode and modify things in the user codebase.


### Tasks
* CLI
* monorepo (migratejs/migratejs-tools)
* exec (run commands)
* warn/check ()
* support dry-run mode
* Ask whether to change the following files by default
* Improve logging
* support --yes option to not ask in CI
* migratejs-tools (support ast related operations)
* Separate testing from prod code
* Parallalize tasks that needs to run on many files (more than 50 [configured] files will run in parallel)