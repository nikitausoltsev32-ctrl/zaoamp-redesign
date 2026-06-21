interface ProductFaqProps {
  faqs: { question: string; answer: string }[]
}

export function ProductFaq({ faqs }: ProductFaqProps) {
  if (!faqs.length) return null

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
          Частые вопросы
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-lg border border-stone-200 bg-stone-50 p-5">
              <summary className="cursor-pointer font-semibold text-foreground">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
