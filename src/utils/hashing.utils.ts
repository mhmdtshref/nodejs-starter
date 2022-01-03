import bcrypt from 'bcrypt';

/**
 * @memberof Hashing
 * @name hashText
 * @description Gets text and return it hashed
 * @param {string} text text to be hashed
 * @returns {string} returns hash as string
 */
const hashText = (text: string) => {
    const hash = bcrypt.hashSync(text, 10);
    return hash;
}

/**
 * @memberof Hashing
 * @name verifyHash
 * @description Checks if the text is the origin of the hash
 * @param {string} text plain text to check
 * @param {string} hash original hash
 * @returns {boolean} true means verified
 */
const verifyHash = (text: string, hash: string) => {
    // Compare hash with original:
    const result = bcrypt.compareSync(text, hash);

    // Return result:
    return result;
}

export default {
    hashText,
    verifyHash,
};
