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
} = {
    config: {
        paths: {
            vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs"
        }
    }
};

export function init(): Promise<Monaco> {
    if (state.monaco) {
        return state.monaco;
    } else {
        state.monaco = new Promise<Monaco>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = `${state.config.paths.vs}/loader.js`;
            script.onload = function () {
                const require = window.require as unknown as MonacoEditorLoader;
                require.config(state.config);
                require(["vs/editor/editor.main"], function (monaco: Monaco) {
                    resolve(monaco);
                }, function (error: unknown) {
                    reject(error);
                });
            };
            script.onerror = reject;
            document.body.appendChild(script);
        });
        return state.monaco;
    }
}

interface MonacoEditorLoader {
    config(configData: unknown): void;
    (modules: string[], resolve: (module: Monaco) => void, reject: (e: unknown) => void): void;
}
