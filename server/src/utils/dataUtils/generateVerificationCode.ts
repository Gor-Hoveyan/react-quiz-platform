export default function generateVerificationCode(length: number) {
    const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i = 0; i < length; i++) {
        result += symbols[Math.floor(Math.random() * symbols.length)]
    }
    return result;
}