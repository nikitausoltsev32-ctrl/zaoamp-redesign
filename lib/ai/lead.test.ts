import assert from 'node:assert/strict'
import test from 'node:test'

import {
  enrichAssistantLead,
  shouldPersistAssistantLead,
  withManagerHandoffConfirmation,
  type AssistantLeadDraft,
} from './lead'

test('enrichAssistantLead extracts phone and purchase fields from user text', () => {
  const lead = enrichAssistantLead(
    {},
    [
      {
        role: 'user',
        content:
          'Меня зовут Игорь, телефон +7 912 345-67-89. Нужна мраморная крошка 5-10 в Казань, 20 тонн, биг-бэги, для дорожек, нужно в июне.',
      },
    ]
  )

  assert.equal(lead.phone, '+7 912 345-67-89')
  assert.equal(lead.name, 'Игорь')
  assert.equal(lead.city, 'Казань')
  assert.equal(lead.quantityTons, 20)
  assert.equal(lead.packaging, 'биг-бэги')
  assert.match(lead.productInterest ?? '', /мраморная крошка 5-10/i)
  assert.match(lead.need ?? '', /дорожек/i)
  assert.match(lead.budget ?? '', /июне/i)
})

test('shouldPersistAssistantLead keeps leads with phone or explicit product interest', () => {
  const phoneLead: AssistantLeadDraft = { phone: '+79123456789' }
  const interestedLead: AssistantLeadDraft = {
    productInterest: 'Микрокальцит 5-200 мкм',
    quantityTons: 5,
  }

  assert.equal(shouldPersistAssistantLead(phoneLead, false), true)
  assert.equal(shouldPersistAssistantLead(interestedLead, false), true)
  assert.equal(shouldPersistAssistantLead({}, false), false)
})

test('withManagerHandoffConfirmation explicitly confirms handoff when phone is present', () => {
  const reply = withManagerHandoffConfirmation(
    'Подойдет крошка 5-10 мм. Финальные условия подтвердит менеджер.',
    { phone: '+79123456789' }
  )

  assert.match(reply, /передал информацию менеджеру/i)
  assert.match(reply, /с вами свяжутся/i)
})
