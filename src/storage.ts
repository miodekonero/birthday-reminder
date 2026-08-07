import {BaseDirectory, create, exists, mkdir, open, readTextFileLines} from "@tauri-apps/plugin-fs";

interface Birthday {
    day: number;
    month: number;
    name: string
}

const filename = "birthdays.csv";
const birthdays: Birthday[] = [];  // todo maybe more efficient way of storage and access, perhaps a rust integration?

export function saveBirthday(birthday: Birthday): void {
    console.assert(!birthday.name.includes(","));
    birthdays.push(birthday);
    file.write(new TextEncoder().encode(`${birthday.day},${birthday.month},${birthday.name}\n`));  // todo error handling
    console.log(birthdays)
}

export function getBirthdaysInMonth(month: number): Birthday[] {
    return birthdays.filter((birthday) => birthday.month === month)
}

if (await exists(filename, {baseDir: BaseDirectory.AppData})) {
    const lines = await readTextFileLines(filename, {baseDir: BaseDirectory.AppData});
    for await (const line of lines) {  // todo error handling
        const birthday_raw = line.split(",");
        birthdays.push({
            day: parseInt(birthday_raw[0]),
            month: parseInt(birthday_raw[1]),
            name: birthday_raw[2]
        })
    }
}
else {  // todo error handling
    await mkdir("", {baseDir: BaseDirectory.AppData});
    const file = await create(filename, {baseDir: BaseDirectory.AppData});
    await file.close();
}

let file = await open(filename, {baseDir: BaseDirectory.AppData, append: true})  // todo error handling
