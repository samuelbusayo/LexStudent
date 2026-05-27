export default function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block px-2 py-0.5 bg-primary/5 text-primary uppercase text-[10px] font-bold rounded-full">
      {label}
    </span>
  )
}
