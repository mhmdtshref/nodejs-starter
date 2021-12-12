import bcrypt from 'bcrypt';

const hashText = (text: string) => {
    const hash = bcrypt.hashSync(text, 10);
    return hash;
}

export default {
    hashText,
};
