module.exports = {
    sequence: function (funcs) {
        return funcs.reduce(function composeAsync(accFn, nextFn) {
            return function(callback) {
                accFn((err, data) => {
                    if (!err) {
                        nextFn(callback, data);
                    } else {
                        callback(err, null);
                    }
                });
            };
        });
    },

    // This is a bit of a misnomer: JavaScript is single threaded so these
    // functions are not actually running in parallel.
    parallel: function (funcs) {
        return function(callback) {
            let counter = 0;
            let results = [];
            funcs.forEach((fn, index) => {
                fn((err, data) => {
                    if (!err) {
                        results[index] = data;
                        counter += 1;
                        if (counter === funcs.length) {
                            callback(null, results);
                        }
                    } else {
                        callback(err, null);
                    }
                });
            });
        };
    },

    race: function (funcs) {
    }
};
