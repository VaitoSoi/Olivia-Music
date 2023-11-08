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
const event_1 = require("../lib/event");
const discord_js_1 = require("discord.js");
exports.default = new event_1.EventBuilder()
    .setName(discord_js_1.Events.InteractionCreate)
    .setOnce(false)
    .setType('discord')
    .setExecute((olivia, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.isCommand()) {
        const command = olivia.commands.collection.get(interaction.commandName);
        if (!command)
            return void (yield interaction.reply('Không thể tìm thấy lệnh :c'));
        yield interaction.deferReply();
        Promise.resolve(command.execute(interaction, olivia))
            .then(() => { })
            .catch((error) => { var _a, _b; return olivia.logger.error('discord', `Occur an error: ${error.stack}\nCommand name: ${interaction.commandName}\nGuild: ${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.name} (${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id})`); });
    }
}));
