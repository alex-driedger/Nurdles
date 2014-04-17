Nurdles
==============
Nurdles is an app used to display beach reports/surveys/ratings about a beaches cleanliness.

IMPORTANT: The sizing of this app is different. In clients/web/index.html it says

$("body").css("font-size", $("body").height()*0.7)

All the sizing is done as a percentage of the total height of the screen.

Index
--------------
This is where you import some of the libraries

Client
--------------
The client is what the user sees and interacts with. It's made up of 4 main parts

1. Models

Models are where the client interacts with the server. The server creates an API and the models retrieve data from that API

2. Routers

This is where you set the URL's for your website paths. (ex. localhost4010/STUFF STUFF is what the router changes)

3. Views

This is the javascript behind your templates: What happens when the user interacts with anything

4. Templates/CSS

This is your html: What the user sees.

Server
--------------
The server is where the data is manipulated. It's made up of 3 main parts

1. API

API is where you create your functions for manipulating the data

2. Models

Models are where you set what you want your data to look like

3. ServerConfig

This is where you set your API routes. The clients models call upon the URL's at the bottom of the server config. Once it's called the data that either gets taken or sent, is based on what the API does with it, and what kind of request it is.