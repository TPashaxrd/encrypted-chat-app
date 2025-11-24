const http = require("http");
const socketio = require("socket.io");
const { applySecurityMiddlewares, applyLoggingMiddleware } = require("./middlewares/SecurityChain");
const express = require("express");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const session = require("express-session");
require("dotenv").config();

const db = require("./config/db");
const AuthRoutes = require("./routes/Auth");
const ChatRoutes = require("./routes/Chat");

const app = express();
app.set("trust proxy", 1);

db();

const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    }
});

const allowedOrigins = [
    "http://localhost:5173"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Cors policy does not allow access from the specified Origin."));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions"
});

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
});

app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on("connection", socket => {
    const session = socket.request.session;

    if (session.userId) {
        socket.join(session.userId.toString());
        console.log("Socket bağlandı:", session.userId);
    } else {
        console.log("Anonim socket bağlandı");
    }
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

applyLoggingMiddleware(app);
applySecurityMiddlewares(app);

app.use("/api/auth", AuthRoutes);
app.use("/api/chat", ChatRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Socket'li server çalışıyor babuş: ${PORT}`);
});