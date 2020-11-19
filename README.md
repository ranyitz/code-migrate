# Migratejs

Perform an automatic migration on a JavaScript/Node based project. The migration tool is a framework that knows how to get a set of instructions and perform the relevant migration base on them.

## The problems
Writing automatic migration is usually painfull and you need to take care of many things, resulting in just providing a migration guide while you could automate parts of the process. From an infrastructure perspective, when developing a toolkit/library there are often cases you'd like to run a script/codemode and modify things in the user codebase.


```
Create An automatic migration tool. It will get an object with keys which are name of files or glob pattern, and value which is a function. The function gets the contents as a variable and the return value will be written to the filesystem. It takes care of logging and writing after all tasks are finished.
It let's to write a post migration custom script which can be used for codemods and Also has a flag to run either npm I or yarn.
01:44
If it gets a Json it automatically parse and serialize it
01:44
If it gets a js file it provides you with the ast
01:50
Ran Yitzhaki Maybe instead of providing the ast we can have a utility belt, similar to jscodeshift that will parse and help mutating the js code.
01:51
It will run prettier after migrating a file
01:52
The idea is that the migration tool is generic, you only need to write the migration logic, and you have things like logging, parsing, reading, writing and more done for you.
01:54
We can also take care of testing, just provide with repo.input and repo.output paths and the testkit will verify that input + migration looks like output so you can develop your migration using tdd
01:54
We can have an option to create a migration commit after the migration is done
02:14
Ran Yitzhaki Globemaster / globmaster
02:52
Ran Yitzhaki Cargojet airlifter codelifter
02:55
Antonov
03:12
Ran Yitzhaki Machump
03:28
Ran Yitzhaki Movers!!!!!
03:29
Movers get instructions. They pack your current house and move your project to the new place ;)
03:30
Movers path/to/instructions.js
07:48
Ran Yitzhaki PostInstall: npm rubln lint --fix
07:48
Commit after each step
07:49
So you'll have separate commits in the end
08:08
Ran Yitzhaki Because we don't want to create a new CLI for each package, maybe we can go with migration-tool my-npm-migration-package or migration-tool migration-tool-recipe-yoshi-5 or even migration-tool yoshi (edited) 
08:09
This will look for a package prefixed with migration tool and suffixes with the version number next major of the existing one in package Json
08:17
Ran Yitzhaki In the signature of a transorm, you'll be able to return an object with source & filename, if supplied, it will be change to the new source or filename
08:22
Each transformation will have a title as a first argument
08:22
It will be used for the CLI to show the transformation name





08:24
The will be an option to run transformations in parallel and there will be a taskr like loader for all tasks````