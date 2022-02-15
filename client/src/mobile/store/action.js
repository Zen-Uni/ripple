/**
 * @description action 以及 action types
 * @author Uni
 * @since 1.0
 */

export const TYPE = {
    authVerify: "AUTH_VERIFY"
}

export const authVerifyAction = data => {
    return {
        type: TYPE.authVerify,
        data
    }
}