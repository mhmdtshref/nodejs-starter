import bcrypt from 'bcrypt';

const hashText = (text: string) => {
    const hash = bcrypt.hashSync(text, 10);
    return hash;
}

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
