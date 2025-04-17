import { LexicalEditor } from "lexical";
import { create } from "zustand";

interface State {
    editor: null | LexicalEditor;
    setEditor: (editor: LexicalEditor) => void;
}
const useEditor = create<State>((set) => ({
    editor: null,
    setEditor: (editor) => set({ editor }),
}));
export default useEditor;