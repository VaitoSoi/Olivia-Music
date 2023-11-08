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
const lib_1 = require("./lib");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: './.env' });
const bot = new lib_1.Olivia({ discord: { token: process.env.TOKEN || '' } });
void bot.run();
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.destroy();
    process.exit(0);
}));
