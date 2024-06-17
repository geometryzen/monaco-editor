import loader, { Monaco } from '@monaco-editor/loader';
import { editor as monacoEditor } from 'monaco-editor';

export class Editor {
    readonly #inner: monacoEditor.IStandaloneCodeEditor;
    #refCount = 1;
    constructor(inner: monacoEditor.IStandaloneCodeEditor) {
        this.#inner = inner;
    }
    get value(): string {
        return this.#inner.getValue();
    }
    set value(value: string) {
        this.#inner.setValue(value);
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.#inner.dispose();
        }
    }
}

export interface EditorConfig {
    extensions?: unknown[],
    parent: HTMLElement;
    value?: string;
}

function monaco_config(config: EditorConfig): monacoEditor.IStandaloneEditorConstructionOptions {
    return {
        value: config.value,
        language: 'javascript'
    };
}

export async function create_editor(config: EditorConfig): Promise<Editor> {
    const loadMonaco = loader.init();

    // const abort = ()=>loadMonaco.cancel();

    const monaco: Monaco = await loadMonaco;

    const inner: monacoEditor.IStandaloneCodeEditor = monaco.editor.create(config.parent, monaco_config(config));
    return new Editor(inner);
}
