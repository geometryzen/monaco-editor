import loader, { Monaco } from "@monaco-editor/loader";
import { editor as monacoEditor } from "monaco-editor";

export interface Disposable {
    dispose(): void;
}

export interface IStandaloneCodeEditor extends Disposable {
    focus(): void;
    getValue(): string;
    setValue(value: string): void;
    onDidChangeModelContent(callback: () => void): Disposable;
}

class Editor implements IStandaloneCodeEditor {
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

export interface IStandaloneEditorConstructionOptions {
    language: string | null;
    lineNumbers?: "on" | "off" | "relative" | "interval" | ((lineNumber: number) => string);
    scrollBeyondLastColumn?: number;
    scrollBeyondLastLine?: boolean;
    value?: string;
}

function monaco_config(config: IStandaloneEditorConstructionOptions): monacoEditor.IStandaloneEditorConstructionOptions {
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

export async function createEditor(domElement: HTMLElement, options: IStandaloneEditorConstructionOptions): Promise<IStandaloneCodeEditor> {
    const monaco: Monaco = await loader.init();
    return new Editor(monaco.editor.create(domElement, monaco_config(options)));
}
