import { createCodeEditor } from "../src/index";

test("createCodeEditor", function () {
    expect(typeof createCodeEditor === "function").toBe(true);
});
