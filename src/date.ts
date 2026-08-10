import {BaseDirectory, create, exists, mkdir, open, readTextFileLines} from "@tauri-apps/plugin-fs";

export const month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const epoch = 1970;
const month_roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
const filename = "birthdays.data";
const birthdays: Birthday[] = [];  // todo maybe more efficient way of storage and access, perhaps a rust integration?

export interface Birthday {
    date: Date;
    name: string;
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
    console.log(birthday)
    file.write(new TextEncoder().encode(`${birthday.date.getDate()} ${month_roman[birthday.date.getMonth()]} ${birthday.name}\n`));  // todo error handling?
}

export function getBirthdaysInMonth(month: number): Birthday[] {
    return birthdays.filter((birthday) => birthday.date.getMonth() === month)
}

if (await exists(filename, {baseDir: BaseDirectory.AppData})) {
    const lines = await readTextFileLines(filename, {baseDir: BaseDirectory.AppData});
    for await (const line of lines) {  // todo error handling
        const birthday_raw = line.split(" ");
        birthdays.push({
            date: new Date(
                epoch,
                month_roman.findIndex(numeral => numeral === birthday_raw[1])!,
                parseInt(birthday_raw[0])
            ),
            name: birthday_raw.slice(2).join(" ")
        })
    }
}
else {  // todo error handling
    if (!exists("", {baseDir: BaseDirectory.AppData})) {
        await mkdir("", {baseDir: BaseDirectory.AppData});
    }
    const file = await create(filename, {baseDir: BaseDirectory.AppData});
    await file.close();
}

let file = await open(filename, {baseDir: BaseDirectory.AppData, append: true})  // todo error handling