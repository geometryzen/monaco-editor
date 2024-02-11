import { editor as monaco } from 'monaco-editor';

export class Editor {
    readonly #inner: monaco.IStandaloneCodeEditor;
    #refCount = 1;
    constructor(inner: monaco.IStandaloneCodeEditor) {
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

function monaco_config(config: EditorConfig): monaco.IStandaloneEditorConstructionOptions {
    return {
        value: config.value,
        language: 'javascript'
    };
}

export function create_editor(config: EditorConfig): Editor {
    const inner: monaco.IStandaloneCodeEditor = monaco.create(config.parent, monaco_config(config));
    return new Editor(inner);
}