interface EmailColumnProps {
  htmlSource: string
}

export function EmailColumn({ htmlSource }: EmailColumnProps) {
  return (
    <div className="email-column">
      <div
        className="email-content"
        dangerouslySetInnerHTML={{ __html: htmlSource }}
      />
    </div>
  )
}