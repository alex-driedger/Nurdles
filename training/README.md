Here's the challenge with web-based applications: There's a lot of different systems in play. 

The basic principles are all fundamental concepts that have been part of computing for decades but aren't often exposed to users, so understanding how they all interact requires loading in a huge amount of information. It's my intent to relay that information in the context of a sample application, I feel it helps with the understanding and takes away some of the pain of digging up all the steps through Google and Stack Overflow. 

Or at least helps identify some helpful keywords while searching.

As much as possible I'm going to leave implementation up to you. I'm going to tell you what to do then leave it to you to discover how to do it, but getting up and running at setting the stage does require that I be explicit - painfully so at times - in the commands that need to be executed and the content of files. 

Assumptions:
I'm a big fan of letting every developer using the tools she prefers. For the sake of this document though, there are some assumptions I'm going to make.

* you are using a stock OS X system, as prepped by me for working at the Apps Factory and configured by you following the welcome.md file.
* you are using Sublime Text 2 for your editor, Chrome as your web browser, and iTerm 2 as your terminal. In the long term, the tools you use is your choice, but for now use these, please.
* you have forked this repository into your github account and cloned it to `~/Factory/Pattern` already, and are accessing this content from your local system.

Begin:

Launch iTerm2, type `cd ~/F[tab]/P[tab]`. By default, OS X uses BASH and has it configured for autocompletion, which is triggered with the tab key and super helpful. Type `open pat[tab]p[tab]`, this should be filled in as `open pattern.sublime-project`. This should open Sublime with the Sidebar open to the "Pattern" folder. It will automatically open the `pattern.sublime-project` file, which you can close using Command-W.

The project structure in the sidebar is the most obvious thing at this point, and without getting into it too deeply just yet, here's what's stored where:

* api: server functionality is exposed to clients here
* bin: scripts related to application execution
* build: output from the Continuous Integration process
* client: client-side functionality lives here
* db: scripts for configuring, initializing and interacting with the database
* node_modules: third party libraries, typically managed by node install
* spec: tests for this application
* test: tests for third party libraries and, somewhat confusingly, this application.
* training: this document and associated resources

Each folder contains additional `README.md` files, which provide a bit more information. If there's information you feel is important and worth sharing, please edit the files directly and issue a pull request. This is a fundamental Apps Factory trait: **make the change you want to see**. It may change before being fully incorporated, but if you identify something as wrong, help us make it right. Please!

One thing you may note about the application is that there's a bunch of server stuff right in the root and a separate area for the client stuff. It may make more sense to have a `server` folder much in the same way there is a `client` folder. And you'd be right! But because we host our applications on Heroku, all server logic must be in the project root. So it's a little messier than I'd prefer, but with reasonable justification.

This could be mitigated with several git repositories, one for the server and one for each of the clients but for the purposes of the Pattern I'm keeping it all together. When we begin a new project for an Apps Factory client, it is likely we will break the repo into several, but for now all-in-one must suffice.

Click on the grey arrow beside `bin` to expand the node, then click on `start`. Note that the file is displayed but a new tab is not created at the top of the document pane in Sublime. Now double-click it. This is moderately strange (but ultimately useful) behaviour for an editor, and can be confusing in the early days. Just keep it in mind, and if you suddenly lose track of the file you were working in, it's probably because you opened it as a preview. If it really bothers you, there is a preference setting you can search out (try Googling "sublime preview") to turn it off.

The file `start` is the entry point into the application. Essentially (which means I'm glossing over a lot detail), all it does is load `app.js` in the root. The files exists primarily to create consistency across development and production environments, as `bin/Procfile` is required by Heroku and does effectively the same thing.

It's a good starting point. It creates an anonymous instance of the class described by `app.js` and calls the `run` function, passing in an environment variable that identifies the port on which it will listen to requests. Open `app.js` in Sublime.

Without getting too deep into it, `app.js` contains one function: `run`. The function configures ExpressJS, initializes the database and loads in the api routes. The last few lines of the file, the assignment of `module.exports` is a RequireJS feature that exposes functions to anything using this file. It's reasonable for now to think of this as defining public functions. Everything within `app.js` is inaccessible outside the class it describes, unless explicitly exported in this manner.

After setting everything up, the `run` function calls `app.listen(port)`, which passes control to ExpressJS. As new requests come into the server, ExpressJS examines the request to figure out how to handle it. This process allows me to divert a little bit and talk about HTTP.

HTTP is the protocol that describes how data is transferred through the World Wide Web. HTTP is a relatively simple Request and Response protocol. A User Agent sends a Request to the server, the server sends a Response. This simple format led to the still typical web application workflow of full page loads for every action the user takes.

AJAX formalized a process that bypasses the full page load. When combined with other preferred application behaviours of the mid-2000s, we got Web 2.0. AJAX still follows this same format, but the browser issues the Request outside the standard workflow, and updates the currently displayed page based on the content of the Response. (The xmlHttpRequest object which makes this possible was first available in Internet Explorer, and is perhaps Microsoft's best contribution to the Web).

Before I can pop out of this tangent I need to go slightly sideways one more time to talk about URLs, then I can finish up with HTTP (for now) and get back to the application. Uniform Resource Locators are a subset of Universal Resource Identifiers (URIs). All URIs identify a resource (perhaps a user). URLs identify where to access that resource, such as http://example.com/user/1. That is a specific user's location and how one interacts with them.

Back up to HTTP for a bit. HTTP Requests have several properties, the one I want to talk about now is the verb. There are many verbs, most are not frequently used. The two most frequently used are GET and POST. From a technical standpoint the differences are unimportant at this time (they will be, don't you worry!) but it is the conceptual differences I want to discuss. 

GET Requests retrieve information *from* a server. So if a User Agent issues a GET request to http://example.com/user/1, the User Agent is asking the server to provide information about that resource - in this example, probably user profile information like user name, picture, etc. 

POST Requests send information *to* a server. If a User Agent issues a POST request to http://example.com/user/1, the User Agent is sending details about that resource to the server. Probably the same profile information but instead of asking the server for what it knows it is providing it to the server.

The other two commonly (though much less so than GET and POST) HTTP verbs used by web applications are PUT and DELETE. These don't matter unless you're trying to be RESTful, which we are. Except I don't really want to get into it right now, just know that being RESTful means that PUT requests are used for updating data, whereas POST requests are used for creating data. I'm pretty sure you can guess what DELETE is used for. This convention is important, and understanding RESTful APIs is awesome and you should totally do so, just not right now. 

And now we return to our regularly-scheduled application exploration.

Well, maybe not exactly. The classic model for web servers is to have a specific file that handles every URL. So if I go to http://example.com/login.php, there is a corresponding file on my server somewhere named login.php. Apache, or whatever web server software I'm using, loads that file and processing starts at line 1. This model is called the Page Controller Pattern. It has largely been superseeded by the Front Controller Pattern.

(The use of "Pattern" in the above names identifies them as Design Patterns, which is a helpful software develoment concept that I'm just going to avoid getting into outside this parenthetical ramble, because I've already thrown about a half-dozen different concepts at you already.)

The Front Controller Pattern dictates that all processing for a web application has a single entry point. Cosmetic benefits of this allow us to disassociate the web application itself from the file structure, so we get less ugly URLs like http://example.com/login or http://example.com/user/1 instead of exposing the architecture of the system to users through more traditional URLs that may use of a QueryString (which I'm also not getting into) such as http://example.com/user.php?id=1.

There are architectural benefits as well, but I'm of the opnion that the pretty URLs are how it took hold. Routes are how we associate these pretty URLs with the functionality we build into an application.

Since the server application is a pure API, the routes are contained in the `api` folder's `index.js` file. This file's primary function `bindRoutes` connects the functionality defined by the other files in the `api` directory and binds it to specific URLs and HTTP methods using ExpressJS' routing system. There are a couple of routes with very simple behaviours that are defined inline as anonymous callbacks, but as the application increases in scope the vast majority of routes will point to functionality stored in other files, not defined inline.

In many ways, this is the point in the application where we start adding real functionality to it. All the previous stuff was setup and configuration. Now we can make the application actually do something.

Out of the box the application has a concept of user accounts and very simple access control, but that's about it. We should start by taking a look at what the application actually does. Use command-tab to switch back to iTerm, then press command-t to create a new tab. Change to the Pattern folder and type `mongod`. This will start the mongo database server, more of which will come later. Use command-shift-[ to switch to the previous tab and type `node bin/start` to begin the application.

Open Chrome, press command-l to jump to the address bar and type `http://localhost:4010`. Username and password are both `appsfactory`. Press login, and revel in the beautiful empty screen. Okay, don't do that, it is actually neither of those things. But! You've now just explored the complete functionality of the application.

Truly, that's it. Logging in. You can't make changes to your account, you can't add any data to the system, nothing. You can't even log out, which is a great thing for us to remedy.

We're almost there! We're going to write some code!

Soon.

I know this is a huge amount of preamble before getting into actual productive work, but after this next bit on git we will have dispensed with the majority of the background and information like the HTTP tangent and stuff will come up less and less frequently.

So, git. Git is a source control system, which is a class of tool developers use to manage code. There are two main benefits to using a source control system, version management and merge resolution. Version management resolves the problem you may have had of wanting to keep a "known good" copy of your code. Many developers work around this by creating multiple project folders, some organized by date or number.

This is a pain in the ass and you should not do it.

Merge resolution is the process that takes place when two or more developers change one or more of the same files at the same time. You and Developer B both edit `index.js`, now you have different copies, which one is the correct one? Well, a third copy that takes into consideration both changes is. 

We're not going to worry about merge resolution right now, but we are going to worry about version control because the second we make changes to any file in the application, we've made a new version of it. Even if it's removing a blank line, or adding a space, something that doesn't have any impact on actual functionality, that is a new version of the file.

Rather than continuing to yammer on about git (seriously, I just deleted another 4 paragraphs that weren't writing software) I'm going to jump ahead and just get you to type these things into iTerm. You should probably open a new tab and switch to the project folder so that mongo and node keep running in the others. Now, type these things:

`git status`
`git branch next`
`git checkout next`
`git branch training`
`git checkout training`

So. Branches are kind of like copies. First we had git report on the current condition of the repository. Mostly because this is just how I always start interacting with git, I want to make sure everything is in a good state. We then created a copy and gave it a name called `next`, then we told git that we wanted to work in the branch named `next`, then we created a copy of `next` called `training` and told git to work in the branch named `training`. Here is some horrible ASCII art:

    master
    |			\
    |				next
    |				|		\
	|				|			training
	
Git versions are a graph, in the Graph Theory sense. I'm going to leave it at this for now so that the back of your brain can ruminate on it while we move on to other things. 

Now, yes, now you can write some code! Back in sublime open `client/web/templates/partials/static/HeaderView.html` and change the  "Communitech Apps Factory" part of the header to your name, so in my case line 3 would read:

`  Rob Drimmie Factory Pattern Application`

Save the file, reload the page in Chrome.

Okay, so I probably couldn't have found a more trivial task. But I have to start somewhere!

Back in iTerm where you did those git commands, do a few more:

`git add .`
`git commit -m 'Rob is making me do trivial things'`

Okay, now lets do something slightly more interesting, we're going to create functionality for users to sign out. Back in sublime, add a newline before `</h1>` on line 4. If you do it from the end of line 3, it will automatically indent to the right point. Do this. Then, make line 4 this:

`  <a href="/#signout">sign out</a>`

Save the file and reload in Chrome. Yuck, super ugly but we'll get to the CSS later. Click the link, and... nothing happens. It looks like the home page. It is the home page. Open `web/client/js/views/router.js`.

This is where routing for the client application is setup. This is different than routing for the server application. When you have a Single Page Application, which we do, then you use javascript to change what is displayed on the page in response to user actions, rather than going to the server. 

We use a library called Backbone.js for a number of purposes, one of them is routing for the web client, and it is in this file that we set it up. The same basic principle as routing for the server applies: We map specific URL paths to specific functionality, though in this case we don't use verbs for anything. In a way, it's all GET requets, though really it's not any kind of request at all.

Technically, what we are doing for client side routing is taking advantage of HTML's A (for Anchor) tag functionality. Anchors have been a part of HTML for ages, possibly since the beginning. They're a navigation tool originally designed to let users jump between different sections of a long document and developers quickly figured out that default behaviour in a browser of changing the location without forcing a trip to the server could be extended.

Anyway, when the user clicks the link causing the location bar to change, an event is triggered and Backbone's Router handles it. If an explicit mapping exists that functionality will be loaded. If no mapping exists, our application is setup to show the very basic HTML page, which contains nothing.

So lets map. Starting on line 13 a javascript object named routes is declared, add a newline after the signin mapping for the signout, I'm sure you can guess the syntax. Later in the file, create a function to handle it. I did so after the signin function declaration and started with:

    signout: function() {
    	console.log( 'signing out' );
    },

In Chrome, refresh the page and hit command-option-j. This opens the developer tools, with the Javascript Console selected. Click the ugly signout link again and the function will execute, logging `signing out` to the console, though not actually signing anything out.

User authentication in this application is managed by Node.js middleware called Passport. It offers several types of authentication, and as a starting point this application uses very typical username & password authentication, managed by a web browser's session. That will change later on, as this mechanism is not readily supported by user agents that are not a web browser but none of that is important right this minute.

Because the authentication is controlled by the server, we need to send a request to the server. Similar functionality exists in the `checkAuth` function in this file, which is called by every BackBone route that requires users be authenticated - for now that's only the `home` function.

