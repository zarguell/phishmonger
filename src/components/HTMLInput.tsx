interface HTMLInputProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export function HTMLInput({ value, onChange, placeholder }: HTMLInputProps) {
  return (
    <div className="html-input-container">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Paste phishing email HTML here...'}
        className="html-input-textarea"
        spellCheck={false}
      />
    </div>
  )
}
