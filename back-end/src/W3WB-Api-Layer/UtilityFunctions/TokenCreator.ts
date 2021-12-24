/**
 * It creates a unique Token
 * @returns Token
 */
export const CreatePublicToken = () => {
    const TokenHead = Date.now().toString(36);
    const TokenTail = Math.random().toString(36).substring(2);

    return TokenHead + TokenTail;
};
