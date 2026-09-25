"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
const middleware_1 = require("./middleware");
const types_1 = require("@repo/common/types");
const client_1 = require("@repo/db/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/signup", async (req, res) => {
    const parseData = types_1.CreateUserSchema.safeParse(req.body);
    if (!parseData.success) {
        res.json({
            message: "Incorrect Inputs"
        });
        return;
    }
    try {
        const user = await client_1.prismaClient.user.create({
            data: {
                email: parseData.data.username,
                password: parseData.data.password,
                name: parseData.data.name,
            }
        });
        res.json({
            userId: user.id
        });
    }
    catch (e) {
        console.error();
        res.status(411).json({ message: "User already exists" });
    }
});
app.post("/signin", async (req, res) => {
    const parseData = types_1.SigninSchema.safeParse(req.body);
    if (!parseData.success) {
        res.json({
            message: "incorrect inputs"
        });
        return;
    }
    const user = await client_1.prismaClient.user.findFirst({
        where: {
            email: parseData.data.username,
            password: parseData.data.password
        }
    });
    if (!user) {
        res.status(403).json({
            message: "not authorized"
        });
        return;
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user?.id
    }, config_1.JWT_SECRET);
    res.json({
        token
    });
});
app.post("/rooms", middleware_1.middleware, async (req, res) => {
    const parseData = types_1.CreateRoomSchema.safeParse(req.body);
    if (!parseData.success) {
        res.json({
            message: "incorrect input"
        });
        return;
    }
    const userId = req.userId;
    try {
        const room = await client_1.prismaClient.room.create({
            data: {
                slug: parseData.data.name,
                adminId: userId,
            }
        });
        res.json({
            roomId: room.id
        });
    }
    catch (e) {
        res.status(411).json({
            message: "room already exists with this name"
        });
    }
});
app.listen(3001);
