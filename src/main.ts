// todo split code into more files
// todo dialog for showing birthdays in a given day
// todo just general code cleanup its very messy right now
// todo error handling.. lots of it
// todo get better at TypeScript..

import { getCurrentWindow } from "@tauri-apps/api/window";

const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function toggleDialog() {
    dialog.open ? dialog.close() : dialog.show();
    calendar.classList.toggle("blurry");
    footer.classList.toggle("blurry");
}

function registerBirthday() {
    if (!dialog_name.value || !dialog_date.value) {
        void displayNotification("Incomplete...")
        return;
    }
    saveBirthday();
    dialog_name.value = "";
    dialog_date.value = "";
    void displayNotification("Saved!");
}

function getBirthdays() {
    // todo
}

function saveBirthday() {
    // todo
}

function getDaysInMonth(date: Date): number {
    const month = date.getMonth();
    if (month === 1) {
        return date.getFullYear() % 4 === 0 ? 29 : 28
    }
    return (month % 7) % 2 === 0 ? 31 : 30
}

function getProperWeekday(date: Date): number {
    const wierd_weekday = date.getDay();
    return wierd_weekday == 0 ? 6 : wierd_weekday - 1
}

function calculateOffset(date: Date): number {
    let offset_date: Date = structuredClone(date);
    offset_date.setDate(1);
    const offset = getProperWeekday(offset_date);
    return offset == 6 ? 0 : offset
}

function updateTitle(): void {
    const date = new Date()
    date_display.innerHTML = months[date.getMonth()] + " " + date.getDate();
}

async function displayNotification(text: string) {
    date_display.innerHTML = text;
    await new Promise(r => setTimeout(r, 2000));
    updateTitle();
}

function update(date: Date, show_next_month?: boolean): void {
    if (show_next_month) { date.setMonth(date.getMonth()+1) }
    getBirthdays();
    const offset = calculateOffset(date);
    while (calendar.firstChild) { calendar.removeChild(calendar.firstChild) }
    let row = document.createElement("tr");
    for (let index = 0; index < offset; index++) { row.append(document.createElement("td")) }
    for (let index = 1; index <= getDaysInMonth(date); index++) {
        let cell = document.createElement("td");
        cell.innerHTML = index.toString();
        cell.id = "date-" + index.toString();
        if (((offset + index - 1) % 7) > 4) {
            cell.classList.add("weekend")
        }
        if (!show_next_month && date.getDate() == index) {
            cell.classList.add("highlight")
        }
        row.append(cell);  // todo marking the date on birthday
        if ((offset + index) % 7 === 0) {
            calendar.append(row);
            row = document.createElement("tr");
        }
    }
    if (row.children) { calendar.append(row) }
}

function switchMonthSelection(button?: HTMLElement | null): void {
    if (!button || !this_month_button || !next_month_button) { return console.error("Uninitialized DOM") }
    update(new Date, button === next_month_button)
    if (button.classList.contains("selected")) { return }
    this_month_button.classList.toggle("selected")
    next_month_button.classList.toggle("selected")
}

const window = getCurrentWindow();  // todo make less.. ugly?
const dialog:            HTMLDialogElement = document.getElementById("dialog")! as HTMLDialogElement;
const close_button:      HTMLElement = document.getElementById("close-button")!;
const date_display:      HTMLElement = document.getElementById("date-display")!;
const add_button:        HTMLElement = document.getElementById("add-button")!;
const calendar:          HTMLElement = document.getElementById("calendar")!;
const this_month_button: HTMLElement = document.getElementById("this-month-button")!;
const next_month_button: HTMLElement = document.getElementById("next-month-button")!;
const footer:            HTMLElement = document.getElementById("footer")!;
const dialog_button:     HTMLElement = document.getElementById("dialog-button")!;
const dialog_name:       HTMLInputElement = document.getElementById("dialog-name")! as HTMLInputElement;
const dialog_date:       HTMLInputElement = document.getElementById("dialog-date")! as HTMLInputElement;

close_button.addEventListener("click", window.close);
add_button.addEventListener("click", toggleDialog);
this_month_button.addEventListener("click", () => {switchMonthSelection(this_month_button)})
next_month_button.addEventListener("click", () => {switchMonthSelection(next_month_button)})
dialog_button.addEventListener("click", registerBirthday)

document.getElementById("title-bar")?.addEventListener("mousedown", (event) => {
    if (event.buttons === 1 && !close_button.matches(":hover") && !add_button.matches(":hover")) {
        window.startDragging().catch((reason) => { console.error(reason) });
    }
});

this_month_button.classList.add("selected")
switchMonthSelection(this_month_button)
updateTitle()