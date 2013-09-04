var self = {
    loginSuccess: function(req, res) {
    	console.log('login success');
        res.writeHead("200", {
            'Content-Type': 'text/json'
        });
        res.write(JSON.stringify(req.user));
        res.end();
    },
};

module.exports = self;