function update(oldState, commands) {
    if ('$apply' in commands) {
        return commands['$apply'](oldState);
    }
    if ('$set' in commands) {
        return commands['$set'];
    }

    // Otherwise operate on the correct type
    if (Array.isArray(oldState)) {
        return updateArray(oldState, commands);
    } else if (typeof oldState === 'object') {
        return updateObject(oldState, commands);
    } else {
        throw new Error('Unsupported operation');
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
    if ('$set' in commands) {
        return update(oldState, commands);
    }

    const newState = {};

    if ('$merge' in commands) {
        Object.keys(commands['$merge']).forEach(key => {
            newState[key] = commands['$merge'][key];
        });
    } else {
        Object.keys(commands).forEach(key => {
            newState[key] = update(oldState[key], commands[key]);
        });
    }

    // Copy unchaged branches
    Object.keys(oldState).forEach(key => {
        if (!(key in newState)) {
            newState[key] = oldState[key];
        }
    });

    return newState;
}

module.exports = update;
