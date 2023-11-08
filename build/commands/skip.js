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
    .setName("skip")
    .setDescription("Bỏ qua bài hát hiện tại")
    .setExecute((interaction, olivia) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const userVC = (_b = (yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user)))) === null || _b === void 0 ? void 0 : _b.voice.channel;
    if (!userVC)
        return interaction.editReply({
            content: 'Bạn không trong Voice Channel :c'
        });
    let botVC = (_d = (yield ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.members.fetchMe()))) === null || _d === void 0 ? void 0 : _d.voice.channel;
    if (!!botVC && botVC.id != userVC.id)
        return interaction.editReply({
            content: 'Bạn không trong cùng Voice Channel với bot D:'
        });
    if (!interaction.guild)
        return;
    (_e = olivia.player.nodes.get(interaction.guild)) === null || _e === void 0 ? void 0 : _e.node.skip();
    interaction.editReply(`Đã bỏ qua bài hát`);
}));
