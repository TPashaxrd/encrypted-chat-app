const Message = require("../models/Message");
const User = require("../models/User");
const { encrypt, decrypt } = require("../utils/crypto");

const SendMessage = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "Login ol lan önce." });
        }

        const { to, text } = req.body;

        if (!to || !text) {
            return res.status(400).json({ message: "Eksik veri yollama aq." });
        }

        const exists = await User.findById(to);
        if (!exists) {
            return res.status(404).json({ message: "Böyle user mı olur knk." });
        }

        const encrypted = encrypt(text);

        const msg = await Message.create({
            from: userId,
            to,
            encryptedText: JSON.stringify(encrypted)
        });

        req.io.to(to.toString()).emit("new_message", {
            from: userId,
            encryptedText: encrypted
        });

        res.json({ message: "Mesaj yollandı", msg });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const GetMessages = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ message: "Giriş yok." });

        const { withUser } = req.params;

        const messages = await Message.find({
            $or: [
                { from: userId, to: withUser },
                { from: withUser, to: userId }
            ]
        });

        const decryptedMessages = messages.map(m => ({
            id: m._id,
            from: m.from,
            to: m.to,
            text: decrypt(JSON.parse(m.encryptedText)),
            createdAt: m.createdAt
        }));

        res.json({ messages: decryptedMessages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { SendMessage, GetMessages };