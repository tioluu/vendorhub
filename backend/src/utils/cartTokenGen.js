import crypto from 'node:crypto';

const hashCartToken = (raw) => {
    return crypto.createHash('sha256').update(raw).digest('hex');
};

const createCartToken = () => {
    const token = crypto.randomBytes(32).toString('base64url');
    const tokenHash = hashCartToken(token);
    return {token, tokenHash};
};

export {hashCartToken};
export {createCartToken};
