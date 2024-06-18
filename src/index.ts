import loader, { Monaco } from "@monaco-editor/loader";
import { editor as monacoEditor } from "monaco-editor";

export interface Disposable {
    dispose(): void;
}

export class Editor implements Disposable {
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
    focus(): void {
        this.#inner.focus();
    }
    getValue(): string {
        return this.#inner.getValue();
    }
    setValue(value: string): void {
        this.#inner.setValue(value);
    }
    onDidChangeModelContent(callback: () => void): Disposable {
        return this.#inner.onDidChangeModelContent(callback);
    }
    dispose(): void {
        this.#inner.dispose();
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
    language: string | null;
    lineNumbers?: "on" | "off" | "relative" | "interval" | ((lineNumber: number) => string);
    scrollBeyondLastColumn?: number;
    scrollBeyondLastLine?: boolean;
    value?: string;
}

function monaco_config(config: EditorConfig): monacoEditor.IStandaloneEditorConstructionOptions {
    return {
        value: config.value,
        language: config.language,
        lineNumbers: config.lineNumbers,
        minimap: {
            enabled: false
        },
        scrollBeyondLastColumn: config.scrollBeyondLastColumn,
        scrollBeyondLastLine: config.scrollBeyondLastLine
    };
}

export async function createEditor(domElement: HTMLElement, config: EditorConfig): Promise<Editor> {
    const monaco: Monaco = await loader.init();
    return new Editor(monaco.editor.create(domElement, monaco_config(config)));
}
