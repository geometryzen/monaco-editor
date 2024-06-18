import { createEditor } from "../src/index";

test("create_editor", function () {
    expect(typeof createEditor === "function").toBe(true);
});
