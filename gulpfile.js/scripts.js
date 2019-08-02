const webpack = require('webpack');

//  webpack configured to bundle js files
function compileJs(cb){
    webpack(require('../webpack.config'), function(err, stats){
        if (err){console.log(err.toString());};
        console.log(stats.toString());
        cb();       
    });
};

const jsTask = compileJs;

module.exports = jsTask;