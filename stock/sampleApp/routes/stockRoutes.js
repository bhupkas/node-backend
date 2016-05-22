
/* Making new router for stocks */

module.exports = function(app) {
	app.get('/stocks', function(req,res) {
		res.send("Stock get");
	});
}
