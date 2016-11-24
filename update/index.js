module.exports = function update(oldState, commands) {
    const newState = {};
    Object.keys(oldState).forEach(key => {
        if (key in commands) {
            const command = commands[key];
            if ('$set' in command) {
                newState[key] = command['$set'];
            } else {
                newState[key] = update(oldState[key], command);
            }
        } else {
            newState[key] = oldState[key];
        }
    });
    return newState;
};
