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

    parallel: function () {
    },

    race: function () {
    }
};
