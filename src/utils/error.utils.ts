import loggerUtils from "./logger.utils";

const getServerError = (log: string) => {
    loggerUtils.error(log);
    return new Error('Server error');
}

const getNotFoundError = (veriableName: string, isUserError: boolean) => {
    if (isUserError) {
        return new Error(`${veriableName} is not found`);
    }
    const log = `${veriableName} is not found`;
    return getServerError(log);
}

const getInvalidError = (veriableName: string, isUserError: boolean, value?: unknown) => {
    if (isUserError) {
        return new Error(`${veriableName} is invalid`);
    }
    const log = `${veriableName} has invalid value: ${JSON.stringify(value)}`;
    return getServerError(log);
}

const getLoginError = (isPassword: boolean) => {
    if (isPassword) {
        return new Error(`Email and password not matched`);
    }
    return new Error('Invalid token');
}

const getRegistrationError = (cause: string, isUserError: boolean) => {
    if (isUserError) {
        return new Error(cause);
    }
    return getServerError(cause);
}

const notMatchedError = (firstVariableName: string, secondVariableName: string, isUserError: boolean) => {
    const message = `${firstVariableName} is not mached with ${secondVariableName}`;
    if (isUserError) {
        return new Error(message)
    }
    return getServerError(message);
}

export default {
    getNotFoundError,
    getInvalidError,
    getLoginError,
    getServerError,
    getRegistrationError,
    notMatchedError,
}
