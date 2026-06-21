import type { SeoLongContent as SeoLongContentData } from '@/types'

interface SeoLongContentProps {
  content: SeoLongContentData
  className?: string
  hideSpecs?: boolean
}

export function SeoLongContent({ content, className, hideSpecs }: SeoLongContentProps) {
  const { lead, sections, outro } = content
  const specs = hideSpecs ? undefined : content.specs

  return (
    <section className={className ?? 'py-12 md:py-16'}>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 text-foreground">
          {lead && lead.length > 0 && (
            <div className="space-y-4">
              {lead.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {sections?.map((section) => (
            <div key={section.heading} className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.items && section.items.length > 0 && (
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.label} className="text-base leading-relaxed text-muted-foreground">
                      <strong className="font-semibold text-foreground">{item.label}.</strong>{' '}
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {specs && specs.rows.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
              <table className="w-full border-collapse text-left text-sm">
                {specs.caption && (
                  <caption className="bg-stone-50 px-6 py-4 text-left text-lg font-bold text-foreground">
                    {specs.caption}
                  </caption>
                )}
                <tbody className="divide-y divide-stone-200">
                  {specs.rows.map((row, index) => (
                    <tr key={row.label} className={index % 2 === 0 ? 'bg-stone-50/50' : 'bg-white'}>
                      <th
                        scope="row"
                        className="px-6 py-3 font-medium text-foreground"
                      >
                        {row.label}
                      </th>
                      <td className="px-6 py-3 text-right text-muted-foreground">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {outro && outro.length > 0 && (
            <div className="space-y-4">
              {outro.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
