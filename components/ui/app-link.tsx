import Link from 'next/link'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { internalHref } from '@/lib/utils/href'

type AppLinkProps = ComponentPropsWithoutRef<typeof Link>

// Единственное место в app/ и components/, где разрешён импорт next/link.
// Прогоняет строковые href через internalHref → канонический слэш.
const AppLink = forwardRef<ElementRef<typeof Link>, AppLinkProps>(function AppLink(
  { href, ...props },
  ref,
) {
  const normalized = typeof href === 'string' ? internalHref(href) : href
  return <Link ref={ref} href={normalized} {...props} />
})

export default AppLink
