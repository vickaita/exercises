function update(oldState, commands) {
    if ('$apply' in commands) {
        return commands['$apply'](oldState);
    }
    if ('$set' in commands) {
        return commands['$set'];
    }
    if ('$push' in commands || '$splice' in commands || '$unshift' in commands) {
        return updateArray(oldState, commands);
    }
    return updateObject(oldState, commands);
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
    const newState = {};

    if ('$merge' in commands) {
        const mergeObj = commands['$merge'];
        Object.keys(mergeObj).forEach(key => newState[key] = mergeObj[key]);
    } else {
        Object.keys(commands).forEach(key => newState[key] = update(oldState[key], commands[key]));
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
