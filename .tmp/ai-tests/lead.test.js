"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const lead_1 = require("./lead");
(0, node_test_1.default)('enrichAssistantLead extracts phone and purchase fields from user text', () => {
    const lead = (0, lead_1.enrichAssistantLead)({}, [
        {
            role: 'user',
            content: 'Меня зовут Игорь, телефон +7 912 345-67-89. Нужна мраморная крошка 5-10 в Казань, 20 тонн, биг-бэги, для дорожек, нужно в июне.',
        },
    ]);
    strict_1.default.equal(lead.phone, '+7 912 345-67-89');
    strict_1.default.equal(lead.name, 'Игорь');
    strict_1.default.equal(lead.city, 'Казань');
    strict_1.default.equal(lead.quantityTons, 20);
    strict_1.default.equal(lead.packaging, 'биг-бэги');
    strict_1.default.match(lead.productInterest ?? '', /мраморная крошка 5-10/i);
    strict_1.default.match(lead.need ?? '', /дорожек/i);
    strict_1.default.match(lead.budget ?? '', /июне/i);
});
(0, node_test_1.default)('shouldPersistAssistantLead keeps leads with phone or explicit product interest', () => {
    const phoneLead = { phone: '+79123456789' };
    const interestedLead = {
        productInterest: 'Микрокальцит 5-200 мкм',
        quantityTons: 5,
    };
    strict_1.default.equal((0, lead_1.shouldPersistAssistantLead)(phoneLead, false), true);
    strict_1.default.equal((0, lead_1.shouldPersistAssistantLead)(interestedLead, false), true);
    strict_1.default.equal((0, lead_1.shouldPersistAssistantLead)({}, false), false);
});
(0, node_test_1.default)('withManagerHandoffConfirmation explicitly confirms handoff when phone is present', () => {
    const reply = (0, lead_1.withManagerHandoffConfirmation)('Подойдет крошка 5-10 мм. Финальные условия подтвердит менеджер.', { phone: '+79123456789' });
    strict_1.default.match(reply, /передал информацию менеджеру/i);
    strict_1.default.match(reply, /с вами свяжутся/i);
});
