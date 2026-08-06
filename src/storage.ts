import {BaseDirectory, create, exists, mkdir, open, readTextFileLines} from "@tauri-apps/plugin-fs";

const filename = "birthdays.csv";
// TODO some birthday variable updated both on start and on submit birthday
// do not read birthday file every time

export function saveBirthday(): void {
    // TODO save birthday
    file.write(new TextEncoder().encode("TODO"));
}

export function getBirthdays(){
    // TODO get birthdays
}

if (await exists(filename, {baseDir: BaseDirectory.AppData})) {
    const lines = await readTextFileLines(filename, {baseDir: BaseDirectory.AppData});
    for await (const line of lines) {
        // TODO load birthdays from file
    }
}
else {
    await mkdir("", {baseDir: BaseDirectory.AppData});
    const file = await create(filename, {baseDir: BaseDirectory.AppData});
    await file.close();
}

let file = await open(filename, {baseDir: BaseDirectory.AppData, append: true})
