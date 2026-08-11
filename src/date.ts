import { BaseDirectory, create, exists, mkdir, open, readTextFileLines } from "@tauri-apps/plugin-fs";
import { message } from "@tauri-apps/plugin-dialog";

export const month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const month_roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
const filename = "birthdays.data";
const birthdays: string[][][] = Array.from({ length: 12 }, () => Array.from({ length: 31 }, () => []))

async function error(error_message: string): Promise<void> {
    await message(
        "Failed to read one of the entries in the data file: " + error_message,
        { title: "Birthday reminder", kind: "error" }
    );
}

export function getDaysInMonth(month: number, year?: number): number {
    if (year === undefined) {
        year = 0
    }
    if (month === 1) {
        return year % 4 === 0 ? 29 : 28
    }
    return (month % 7) % 2 === 0 ? 31 : 30
}

export function calculateOffset(month: number, year: number): number {
    let offset_date = new Date(year, month, 1);
    const weekday = offset_date.getDay();
    return weekday === 0 ? 0 : weekday - 1
}

export function saveBirthday(day: number, month: number, name: string, save_to_file?: boolean): void {
    if (save_to_file !== false) {
        void file.write(new TextEncoder().encode(`${day} ${month_roman[month]} ${name}\n`));
    }
    birthdays[month][day-1].push(name);
}

export function getBirthdays(day: number, month: number): string[] {
    return birthdays[month][day-1]
}


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
    else if (day < 1 || day > getDaysInMonth(0, month)) {
        await error("day not in specified month");
        continue;
    }

    saveBirthday(day, month, birthday_raw.slice(2).join(" "), false);
}

let file = await open(filename, { baseDir: BaseDirectory.AppData, append: true });
console.log(birthdays)