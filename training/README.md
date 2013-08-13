Here's the challenge with web-based applications: There's a lot of different systems in play. 

The basic principles are all fundamental concepts that have been part of computing for decades but aren't often exposed to users, so understanding how they all interact requires loading in a huge amount of information. It's my intent to relay that information in the context of a sample application, I feel it helps with the understanding and takes away some of the pain of digging up all the steps through Google and Stack Overflow. 

As much as possible I'm going to leave implementation up to you. I'm going to tell you what to do then leave it to you to discover how to do it, but getting up and running at setting the stage does require that I be explicit - painfully so at times - in the commands that need to be executed and the content of files. 

Assumptions:
I'm a big fan of letting every developer using the tools she prefers. For the sake of this document though, there are some assumptions I'm going to make.

* you are using a stock OS X system, as prepped by me for working at the Apps Factory and configured by you following the welcome.md file
* you are using Sublime Text 2 for your editor
* you have cloned this repository to `~/Factory/Pattern` already, and are accessing the content from your local system

Begin:

Launch iTerm2, type `cd ~/F[tab]/P[tab]`. By default, OS X uses BASH and has it configured for autocompletion, which is triggered with the tab key and super helpful. Type `open pat[tab]p[tab]`, this should be filled in as `open pattern.sublime-project`. This should open Sublime with the Sidebar open to the "Pattern" folder. It will automatically open the `pattern.sublime-project` file, which you can close using Command-W.

The project structure in the sidebar is the most obvious thing at this point, and without getting into it too deeply yet, here's what's stored where:

* bin: scripts related to application execution
* build: output from the Continuous Integration process
* db: scripts for configuring, initializing and interacting with the database


Each folder contains additional `README.md` files, which provide a bit more information. If there's information you feel is important and worth sharing, please edit the files directly and issue a pull request. This is a fundamental Apps Factory trait: **make the change you want to see**. It may change before being fully incorporated, but if you identify something as wrong, help us make it right. Please!

