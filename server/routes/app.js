var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    // res.sendFile(path.join(__dirname, '../../', 'dist/index.html'));
    res.send('api works');
});

module.exports = router;