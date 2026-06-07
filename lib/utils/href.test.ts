import assert from 'node:assert/strict'
import test from 'node:test'

import { internalHref } from './href.ts'

test('appends slash to internal path', () => {
  assert.equal(internalHref('/catalog'), '/catalog/')
  assert.equal(internalHref('/product/mramornaya-kroshka-5-10'), '/product/mramornaya-kroshka-5-10/')
})

test('leaves root and already-slashed paths unchanged', () => {
  assert.equal(internalHref('/'), '/')
  assert.equal(internalHref('/catalog/'), '/catalog/')
})

test('skips files with an extension (.pdf)', () => {
  assert.equal(internalHref('/documents/pasport-0-0-2.pdf'), '/documents/pasport-0-0-2.pdf')
})

test('skips external, mailto, tel and anchor hrefs', () => {
  assert.equal(internalHref('https://yandex.ru/maps/-/CDX'), 'https://yandex.ru/maps/-/CDX')
  assert.equal(internalHref('mailto:evoprod@mail.ru'), 'mailto:evoprod@mail.ru')
  assert.equal(internalHref('tel:+79193931992'), 'tel:+79193931992')
  assert.equal(internalHref('#section'), '#section')
  assert.equal(internalHref('//cdn.example.com/x'), '//cdn.example.com/x')
})

test('preserves query and hash', () => {
  assert.equal(internalHref('/catalog?sort=price'), '/catalog/?sort=price')
  assert.equal(internalHref('/about#team'), '/about/#team')
})
