import { Node, mergeAttributes } from '@tiptap/core'
import { v4 as uuidv4 } from 'uuid'

export const LureMark = Node.create({
  name: 'lureMark',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      lureId: {
        default: () => uuidv4(),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-lure-id]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes || {}, {
        'data-lure-id': HTMLAttributes?.lureId,
        class: 'lure-mark',
      }),
      0,
    ]
  },
})
