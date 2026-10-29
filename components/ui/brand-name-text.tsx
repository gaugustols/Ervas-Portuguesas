/** Highlights the product name without changing its wording or surrounding text. */
export function BrandNameText({ children }: { children: string }) {
  return <>{children.split(/(Botica Viva)/gi).map((part, index) =>
    /^Botica Viva$/i.test(part)
      ? <span className="landing-brand-name" key={index}>{part}</span>
      : part
  )}</>;
}
