module.exports = function throttlePromises(n, arr) {
    return new Promise((resolve, reject) => {
        let pool = arr.concat();
        let next = 0;
        let completed = 0;
        let results = [];
        for (let i = 0; i < n; i++) {
            process(i);
        }
        function process(index) {
            next++;
            pool[index]().then(r => {
                results[index] = r;
                completed++;
                if (next < pool.length) {
                    process(next)
                } else if (completed === pool.length) {
                    resolve(results);
                }
            });
        }
    });
};
