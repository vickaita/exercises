module.exports = function throttlePromises(n, arr) {
    return new Promise((resolve, reject) => {
        processNextBatch([], arr.concat());
        function processNextBatch(acc, batches) {
            const batch = batches.splice(0, n);
            if (batch.length) {
                Promise.all(batch.map(fn => fn())).then((res) => {
                    processNextBatch(acc.concat(res), batches);
                });
            } else {
                resolve(acc);
            }
        }
    });
};
