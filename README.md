# Migratejs

Perform an automatic migration on a JavaScript/Node based project. The migration tool is a framework that knows how to get a set of instructions and perform the relevant migration base on them.

## The problems
Writing automatic migration is usually painfull and you need to take care of many things, resulting in just providing a migration guide while you could automate parts of the process. From an infrastructure perspective, when developing a toolkit/library there are often cases you'd like to run a script/codemode and modify things in the user codebase.


### Tasks
* exec (run commands)
* stringify json for the user in case an object is passed
* Create a full e2e test
* warn/check ()
* migratejs-tools (support ast related operations)
* Separate testing from prod code
* consider adding a `read` task for case the user only wants to retrieve information
* add a way to create scopes for a single logical task
* consider having ensure method

