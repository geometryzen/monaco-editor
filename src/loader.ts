import { editor as monacoEditor } from "monaco-editor";

export interface EditorNamespace {
    create(domElement: HTMLElement, options: monacoEditor.IStandaloneEditorConstructionOptions): monacoEditor.IStandaloneCodeEditor;
    defineTheme(themeName: string, themeData: monacoEditor.IStandaloneThemeData): void;
    setTheme(themeName: string): void;
}

export interface Monaco {
    editor: EditorNamespace;
}

const state: {
    config: {
        paths: {
            vs: string;
        };
    };
    monaco?: Promise<Monaco>;
    resolve(monaco: Monaco | PromiseLike<Monaco>): void;
    reject(e: unknown): void;
} = {
    config: {
        paths: {
            vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs"
        }
    },
    resolve: () => {},
    reject: () => {}
};

export function init(): Promise<Monaco> {
    if (getWindowMonaco()) {
        return Promise.resolve(getWindowMonaco());
    }

    if (state.monaco) {
        return state.monaco;
    } else {
        return (state.monaco = new Promise<Monaco>((resolve, reject) => {
            state.resolve = resolve;
            state.reject = reject;
            const script = createMonacoLoaderScriptElement();
            injectScriptElement(script);
        }));
    }
}

function injectScriptElement(script: HTMLScriptElement) {
    return document.body.appendChild(script);
}

function createScriptElement(src: string): HTMLScriptElement {
    const script = document.createElement("script");
    script.src = src;
    return script;
}

function createMonacoLoaderScriptElement(): HTMLScriptElement {
    const script = createScriptElement(`${state.config.paths.vs}/loader.js`);
    script.onload = () => configureLoader();
    script.onerror = state.reject;
    return script;
}

interface MonacoEditorLoader {
    config(configData: unknown): void;
    (modules: string[], resolve: Function, reject: Function): void;
}

function configureLoader() {
    const require = window.require as unknown as MonacoEditorLoader;

    require.config(state.config);
    require(["vs/editor/editor.main"], function (monaco: Monaco) {
        state.resolve(monaco);
    }, function (error: unknown) {
        state.reject(error);
    });
}

function getWindowMonaco(): Monaco | undefined {
    return window as unknown as { [name: string]: Monaco }["monaco"];
}
