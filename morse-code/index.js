const DOT = {toggle: true, duration: 1};
const DASH = {toggle: true, duration: 3};
const BETWEEN_DOTS = {toggle: false, duration: 1};
const BETWEEN_LETTERS = {toggle: false, duration: 3};
const BETWEEN_WORDS = {toggle: false, duration: 7};

module.exports = function transmitter({codes, message, toggle, timeouter}, callback) {
    const encoded = [];
    message.split('').forEach((character, messageIndex) => {
        const messageComplete = messageIndex === message.length - 1;
        if (character === ' ') {
            encoded.push(BETWEEN_WORDS);
        } else {
            const code = codes[character].split('');
            code.forEach((dotOrDash, codeIndex) => {
                encoded.push(dotOrDash === '.' ? DOT : DASH);
                const letterComplete = codeIndex === code.length -1;
                const wordComplete = message[messageIndex + 1] === ' ';
                if (!letterComplete) {
                    encoded.push(BETWEEN_DOTS);
                } else if (!messageComplete && !wordComplete) {
                    encoded.push(BETWEEN_LETTERS);
                }
            });
        }
    });
    function transmit(ops) {
        if (!ops.length) {
            callback();
        } else {
            const op = ops[0];
            if (op.toggle) {
                toggle();
            }
            timeouter(() => transmit(ops.slice(1)), op);
        }
    }
    transmit(encoded);
};
