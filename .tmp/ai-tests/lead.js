"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichAssistantLead = enrichAssistantLead;
exports.shouldPersistAssistantLead = shouldPersistAssistantLead;
exports.withManagerHandoffConfirmation = withManagerHandoffConfirmation;
const PHONE_PATTERN = /(?:\+?\d[\d\s().-]{8,}\d)/;
const QUANTITY_PATTERN = /(\d+(?:[,.]\d+)?)\s*(?:т|тонн|тонны|тонна)(?=\s|[,.!?]|$)/i;
const NAME_PATTERN = /(?:меня зовут|мое имя|моё имя|я)\s+([А-ЯЁA-Z][а-яёa-z-]{1,30})/i;
const CITY_PATTERN = /(?:в|до|город|доставка в|доставк[ау]\s+в)\s+([А-ЯЁA-Z][а-яёa-z -]{2,40})(?=[,.]|$)/i;
const PRODUCT_PATTERN = /((?:мраморн(?:ая|ую|ой)\s+)?(?:крошк[ауи]|щебень|мук[ауи])(?:\s+\d+(?:[,.]\d+)?\s*[-–]\s*\d+(?:[,.]\d+)?\s*(?:мм|мкм)?)?|микрокальцит(?:\s+\d+\s*[-–]\s*\d+\s*мкм)?)/i;
const PACKAGING_PATTERN = /(биг[-\s]?бэг(?:и|ах|ов)?|мешк(?:и|ах|ов)?\s*(?:25|50)?\s*кг|навалом|россыпью)/i;
const NEED_PATTERN = /(?:для|задача[:\s]+|нужно для|используем для)\s+([^,.!?]{3,90})/i;
const TIMING_BUDGET_PATTERN = /((?:бюджет\s*[:\-]?\s*[^,.!?]{2,40})|(?:(?:нужно|надо|желательно|сроки?|поставка)\s+(?:до|к|в)\s+[а-яёa-z0-9 ]{3,30}))/i;
function clean(value) {
    const trimmed = value?.trim().replace(/\s+/g, ' ');
    return trimmed || undefined;
}
function lastUserText(messages) {
    return messages
        .filter((message) => message.role === 'user')
        .map((message) => message.content)
        .join('\n')
        .slice(-4000);
}
function extractFirst(pattern, text) {
    return clean(text.match(pattern)?.[1]);
}
function normalizeQuantity(value) {
    if (!value)
        return undefined;
    const quantity = Number(value.replace(',', '.'));
    return Number.isFinite(quantity) && quantity > 0 ? quantity : undefined;
}
function enrichAssistantLead(draft, messages) {
    const text = lastUserText(messages);
    const quantityTons = draft.quantityTons ?? normalizeQuantity(extractFirst(QUANTITY_PATTERN, text));
    const productInterest = draft.productInterest ?? extractFirst(PRODUCT_PATTERN, text);
    const need = draft.need ?? extractFirst(NEED_PATTERN, text);
    return {
        ...draft,
        name: clean(draft.name) ?? extractFirst(NAME_PATTERN, text),
        phone: clean(draft.phone) ?? clean(text.match(PHONE_PATTERN)?.[0]),
        city: clean(draft.city) ?? extractFirst(CITY_PATTERN, text),
        need: clean(need),
        productInterest: clean(productInterest),
        quantityTons,
        packaging: clean(draft.packaging) ?? clean(text.match(PACKAGING_PATTERN)?.[0]),
        budget: clean(draft.budget) ?? extractFirst(TIMING_BUDGET_PATTERN, text),
        summary: clean(draft.summary),
    };
}
function shouldPersistAssistantLead(lead, modelRequestedSave, messages = []) {
    if (modelRequestedSave)
        return true;
    if (lead.phone?.trim())
        return true;
    if (lead.productInterest?.trim())
        return true;
    if (lead.quantityTons || lead.packaging?.trim())
        return true;
    const text = lastUserText(messages).toLowerCase();
    return /(купить|заказать|рассчитать|кп|коммерческое|нужн[аоы]?|интересует|оставить телефон)/i.test(text);
}
function withManagerHandoffConfirmation(reply, lead) {
    const cleanReply = clean(reply) ?? '';
    if (!lead.phone?.trim())
        return cleanReply;
    if (/передал[аи]?|передан[ао]?|с вами свяжутся|свяжется менеджер/i.test(cleanReply)) {
        return cleanReply;
    }
    return `${cleanReply}\n\nПередал информацию менеджеру: с вами свяжутся, чтобы подтвердить наличие, доставку и финальную цену.`;
}
