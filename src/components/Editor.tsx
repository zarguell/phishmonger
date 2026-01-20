import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { LureMark } from '../extensions/LureMark'
import { sanitizeHtml } from '../utils/sanitizeHtml'

interface EditorProps {
  content?: string
  onUpdate?: (content: string) => void
}

export function Editor({ content = '', onUpdate }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      LureMark,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
      handlePaste: (view, event) => {
        event.preventDefault()
        const html = event.clipboardData?.getData('text/html') || ''
        const text = event.clipboardData?.getData('text/plain') || ''

        const sanitized = html ? sanitizeHtml(html) : text
        const { from } = view.state.selection
        view.dispatch(
          view.state.tr.insertText(sanitized, from)
        )
        return true
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleLink({ href: prompt('Enter URL:') || '' }).run()}
          disabled={!editor.can().chain().focus().toggleLink({ href: '' }).run()}
          className={`toolbar-btn ${editor.isActive('link') ? 'is-active' : ''}`}
        >
          Link
        </button>
        <div className="toolbar-divider" />
        <button
          onClick={() => {
            const lureId = crypto.randomUUID()
            editor
              .chain()
              .focus()
              .setMark('lureMark', { lureId })
              .run()
          }}
          disabled={editor.state.selection.empty}
          className="toolbar-btn toolbar-btn-lure"
        >
          Mark Lure
        </button>
      </div>
      <EditorContent editor={editor} className="editor-content" />
    </div>
  )
}
