import { create_editor } from "../src/index";

test("create_editor", function () {
    expect(typeof create_editor === "function").toBe(true);
});
