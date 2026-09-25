"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const users = [];
function checkUser(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (typeof decoded == "string") {
            return null;
        }
        if (!decoded || !(decoded).userId) {
            return null;
        }
        return decoded.userId;
    }
    catch (e) {
        return null;
    }
}
wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);
    if (!userId) {
        ws.close();
        return null;
    }
    users.push({
        userId,
        rooms: [],
        ws
    });
    ws.on('message', function message(data) {
        const parseData = JSON.parse(data);
        if (parseData.type === "join_room") {
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(parseData.roomId);
        }
        if (parseData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }
            user.rooms = user?.rooms.filter(x => x === parseData.room);
        }
        if (parseData.type === "chat") {
            const roomId = parseData.roomId;
            const message = parseData.message;
            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId
                    }));
                }
            });
        }
    });
});
