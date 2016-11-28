const DOT = 1;
const DASH = 3;
const BETWEEN_DOTS = 1;
const BETWEEN_LETTERS = 3;
const BETWEEN_WORDS = 7;

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
    function transmit(timings) {
        toggle();
        if (!timings.length) {
            callback();
        } else {
            timeouter(() => transmit(timings.slice(1)), timings[0]);
        }
    }
    transmit(encoded);
};
