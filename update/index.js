module.exports = function update(oldState, commands) {
    // $apply works on any value
    if ('$apply' in commands) {
        return commands['$apply'](oldState);
    }

    // Otherwise operate on the correct type
    if (Array.isArray(oldState)) {
        return updateArray(oldState, commands);
    } else if (typeof oldState === 'object') {
        return updateObject(oldState, commands);
    } else {
        // TODO
    }
};

function updateArray(oldState, commands) {
    const command = Object.keys(commands)[0];
    const args = commands[command];
    const newState = oldState.concat();
    switch (command) {
        case '$push':
            args.forEach(arg => Array.prototype.push.apply(newState, args));
            break;
        case '$splice':
            args.forEach(arg => Array.prototype.splice.apply(newState, arg));
            break;
        case '$unshift':
            args.forEach(arg => Array.prototype.unshift.apply(newState, args));
            break;
        default:
            throw new Error('Unsupported operation');
    }
    return newState;
}

function updateObject(oldState, commands) {
}
