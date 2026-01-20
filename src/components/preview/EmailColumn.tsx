interface EmailColumnProps {
  htmlSource: string
}

export function EmailColumn({ htmlSource }: EmailColumnProps) {
  return (
    <div className="email-column">
      {/* Inner container ensures width: 100% and proper padding */}
      <div
        className="email-content"
        dangerouslySetInnerHTML={{ __html: htmlSource }}
      />
    </div>
  )
}