Pattern
=======

The Apps Factory Pattern is a project template, development methodolgy and training tool.

Its primary purpose is as the template which provides a stable and predictable foundation for new web-based applications.

## Template

The Apps Factory Pattern technology stack consists of the following components, identified by the major system in which they exist.

### Server
* MongoDB for data storage and management
* Mongoose to aid NodeJS interaction with MongoDB
* NodeJS for data access and exposure through API 
* ExpressJS web application framework
* Passport for user authentication and access control
* Mocha, Chai and Sinon for unit testing

### Web Client
* BackboneJS for data storage and communication with server
* Topcoat for basic interface components
* (Optional) PhoneGap for native hardware access on mobile devices

### BlackBerry Native Client
* To Be Determined

### iOS Client
* To Be Determined

### Android Client
* To Be Determined

### Other Native Clients
* To Be Determined


## Methodology
The Apps Factory Pattern Methodology is an adaptive development methodology, based on typical Open Source project workflows, Scrum and the lessons learned in managing client expectations.

As a general rule, few of our customers are comfortable with a pure Scrum methodology as they are very new to software development and really need to understand what to expect while development is underway and be comfortable that they can predict with some level of accuracy what the final outcome is. 

### Style guide
- Javascript style enforced with JSHint
- CSS written following BEM Architecture


### Git Workflow
- master, next, feature/bug branch. 
- remote branch created for any branch that lives for more than a few hours
- pull requests into next must be reviewed and accepted by someone else
- pull requests into master must be reviewed and accepted after review on Heroku -next app (see Deployment section).
- frequent commits, and pushes into remote branch every two days at most

### Continuous Integration
- using Jenkins
- tests automatically run ideally when push occurs, absolutely when push occurs into next

### Deployment
- Deployment is manual, and occurs at a minimum every Thursday by 12pm
- Web applications hosted Heroku, unless project constraints make it impractical
- two Heroku apps: caf-[projectName] ("production") and caf-[projectName]-next ("staging")
- caf-[projectName] must always be stable. Clients must be able to predict behaviours and share with interested third parties at the client's discretion
- caf-[projectName]-next is "staging" server. After pull request into next is accepted, project is deployed to the -next app and reviewed. Any known issues are identified and where practical resolved.
- changelog is created, ideally from commit messages.
- changelog includes list of known issues
- when -next app is stable and changelog is complete, project is deployed to production, reviewed and client is notified

## Training

The training materials included here are intended to help new Apps Factory developers learn the foundations of web applications and the tools associated with development, all within the context of a real project.

