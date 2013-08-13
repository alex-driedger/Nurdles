@TODO Change folder name to webclient

The `webclient` folder stores information for the web-based client. 

This client is setup as a primarily single-page application. This differs from the classic web application model of retrieving composed sets of data from the server with single requests. Instead of sending a request to the server and receiving a large set of html to be rendered, an SPA start with a basic framework from the server and fills in the page's components on-the-fly using Javascript to render data received from the server.

More specificaly, in response to user actions the client composes a request that is sent to the server using `AJAX` (which is a bit of an inaccurate term in modern use, but it appropriately captures the intent and process). The server responds with a block of JSON-formatted data, which is then wrapped in HTML by the client using JavaScript and added to the page's Document Object Model (DOM).

This client uses BackboneJS to handle data communications and storage (the Models) and presentation (the Views). The `templates` folder stores basic HTML snippets which are the basis of the Views. The `css` folder contains static css files and the `img` directory stores binary images used by the application.

The bulk of application logic is in the `js` folder, which contains:

* `collections` - BackboneJS collection definitions
* `components` - third-party interface components, eg date pickers etc
* `libs` - third-party javascript libraries
* `models` - BackboneJS model definitions
* `utils` - generic application-wide functionality
* `views` - BackboneJS view definitions
* `app.js` - this is the entry point into the client-side application @TODO Verify
* `main.js` - @todo - I'm not sure, I think it's a requirement of one of the libraries.
* `router.js` - describes client-side routes
* `text.js` - @todo - I'm not sure. Related to main.js.