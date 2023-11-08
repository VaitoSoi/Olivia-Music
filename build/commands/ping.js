"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../lib/command");
exports.default = new command_1.CommandBuilder()
    .setName('ping')
    .setDescription('Kiểm tra độ trễ của bot')
    .setExecute((interaction, olivia) => {
    void interaction.editReply({
        content: `🏓 pong after ${olivia.client.ws.ping}ms`
    });
});
