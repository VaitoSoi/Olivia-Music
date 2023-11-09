"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../lib/command");
exports.default = new command_1.CommandBuilder()
    .setName("leave")
    .setDescription("Thoát khỏi VC hiện tại")
    .setExecute((interaction, olivia) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.guild)
        return;
    const queue = olivia.player.nodes.get(interaction.guild);
    if (queue)
        queue.node.stop();
    (yield interaction.guild.members.fetchMe()).voice.disconnect();
    interaction.editReply('Đã ngắt kết nối.');
}));
