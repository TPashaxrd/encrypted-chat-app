const crypto = require("crypto");

const SECRET_KEY = crypto.randomBytes(32);  
const IV = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return {
        iv: IV.toString("hex"),
        data: encrypted
    };
}

function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        SECRET_KEY,
        Buffer.from(encrypted.iv, "hex")
    );
    let decrypted = decipher.update(encrypted.data, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

module.exports = { encrypt, decrypt };