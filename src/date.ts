import { BaseDirectory, create, exists, mkdir, open, readTextFileLines } from "@tauri-apps/plugin-fs";
import { message } from "@tauri-apps/plugin-dialog";

export const month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const epoch = 1970;
const month_roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
const filename = "birthdays.data";
const birthdays: Birthday[] = [];  // todo maybe more efficient way of storage and access, perhaps a rust integration?

export interface Birthday {
    date: Date;
    name: string;
}

async function error(error_message: string): Promise<void> {
    await message(
        "Failed to read one of the entries in the data file: " + error_message,
        { title: "Birthday reminder", kind: "error" }
    );
}

export function getDaysInMonth(date: Date): number {
    const month = date.getMonth();
    if (month === 1) {
        return date.getFullYear() % 4 === 0 ? 29 : 28
    }
    return (month % 7) % 2 === 0 ? 31 : 30
}

export function calculateOffset(date: Date): number {
    let offset_date: Date = structuredClone(date);
    offset_date.setDate(1);
    const weekday = offset_date.getDay();
    return weekday === 0 ? 0 : weekday - 1
}

export function saveBirthday(birthday: Birthday): void {
    birthdays.push(birthday);
    void file.write(new TextEncoder().encode(`${birthday.date.getDate()} ${month_roman[birthday.date.getMonth()]} ${birthday.name}\n`));  // todo error handling?
}

export function getBirthdaysInMonth(month: number): Birthday[] {
    return birthdays.filter((birthday) => birthday.date.getMonth() === month)
}
// its kinda annoying that some function use month as number, some month as date todo make up my mind


if (!exists("", { baseDir: BaseDirectory.AppData })) {
    await mkdir("", { baseDir: BaseDirectory.AppData });
}
if (!exists(filename, { baseDir: BaseDirectory.AppData })) {
    const file = await create(filename, { baseDir: BaseDirectory.AppData });
    await file.close();
}

for await (const line of await readTextFileLines(filename, { baseDir: BaseDirectory.AppData })) {
    const birthday_raw = line.split(" ");
    const month = month_roman.findIndex(numeral => numeral === birthday_raw[1].toUpperCase());
    const day = parseInt(birthday_raw[0]);
    const date = new Date(epoch, month, day);
    
    if (birthday_raw.length < 3) {
        await error("an entry must consist of a day, a month in roman numerals, and a name, separated by spaces");
        continue
    }
    else if (month === -1) {
        await error("incorrect month");
        continue;
    }
    else if (Number.isNaN(day)) {
        await error("incorrect day");
        continue;
    }
    else if (day < 1 || day > getDaysInMonth(date)) {
        await error("day not in specified month");
        continue;
    }

    birthdays.push({ date: date, name: birthday_raw.slice(2).join(" ") })
}

let file = await open(filename, { baseDir: BaseDirectory.AppData, append: true })