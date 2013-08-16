var self = {
    loginSuccess: function(req, res) {
        res.writeHead("200", {
            'Content-Type': 'text/json'
        });
        res.write(JSON.stringify(req.user));
        res.end();
    }
};

module.exports = self;