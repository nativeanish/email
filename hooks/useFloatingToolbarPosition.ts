import { useEffect, useState } from 'react';
import {
    $getSelection,
    $isRangeSelection,
    ParagraphNode,
} from 'lexical';
import useEditor from '../store/useEditor';
import { HeadingNode, } from '@lexical/rich-text';
import { ListNode } from '@lexical/list';

export function useFloatingToolbarPosition() {
    const editor = useEditor((state) => state.editor);
    const [position, setPosition] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!editor) {
            return;
        }
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();

                if (
                    !$isRangeSelection(selection) ||
                    selection.isCollapsed()
                ) {
                    setPosition(null);
                    return;
                }

                const anchorNode = selection.anchor.getNode();
                const parent = anchorNode.getParent();

                const isValidParent =
                    parent instanceof ParagraphNode ||
                    parent instanceof HeadingNode ||
                    parent instanceof ListNode;

                if (!isValidParent) {
                    setPosition(null);
                    return;
                }

                const domRange = window.getSelection()?.getRangeAt(0);
                if (domRange) {
                    const rect = domRange.getBoundingClientRect();
                    setPosition(rect);
                } else {
                    setPosition(null);
                }
            });
        });
    }, [editor]);

    return position;
}
