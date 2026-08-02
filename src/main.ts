// todo dialog for showing birthdays in a given day
// todo just general code cleanup its very messy right now
// todo error handling.. lots of it
// todo get better at TypeScript..

import * as dom from "./dom.ts";
import { getDaysInMonth, calculateOffset, months } from "./date.ts";
import { getCurrentWindow } from "@tauri-apps/api/window";

const window = getCurrentWindow();

function toggleDialog() {
    dom.dialog.open ? dom.dialog.close() : dom.dialog.show();
    dom.calendar.classList.toggle("blurry");
    dom.footer.classList.toggle("blurry");
}

function registerBirthday() {
    if (!dom.dialog_name.value || !dom.dialog_date.value) {
        void displayNotification("Incomplete...")
        return;
    }
    saveBirthday();
    dom.dialog_name.value = "";
    dom.dialog_date.value = "";
    void displayNotification("Saved!");
}

function getBirthdays() {
    // todo
}

function saveBirthday() {
    // todo
}

function updateTitle(): void {
    const date = new Date()
    dom.date_display.innerHTML = months[date.getMonth()] + " " + date.getDate();
}

async function displayNotification(text: string) {
    dom.date_display.innerHTML = text;
    await new Promise(r => setTimeout(r, 2000));
    updateTitle();
}

function update(date: Date, show_next_month?: boolean): void {
    if (show_next_month) { date.setMonth(date.getMonth()+1) }
    getBirthdays();
    const offset = calculateOffset(date);
    while (dom.calendar.firstChild) { dom.calendar.removeChild(dom.calendar.firstChild) }
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
            dom.calendar.append(row);
            row = document.createElement("tr");
        }
    }
    if (row.children) { dom.calendar.append(row) }
}

function switchMonthSelection(button: HTMLElement): void {
    update(new Date, button === dom.next_month_button)
    if (button.classList.contains("selected")) { return }
    dom.this_month_button.classList.toggle("selected")
    dom.next_month_button.classList.toggle("selected")
}

dom.close_button.addEventListener("click", window.close);
dom.add_button.addEventListener("click", toggleDialog);
dom.this_month_button.addEventListener("click", () => {switchMonthSelection(dom.this_month_button)})
dom.next_month_button.addEventListener("click", () => {switchMonthSelection(dom.next_month_button)})
dom.dialog_button.addEventListener("click", registerBirthday)

dom.header.addEventListener("mousedown", (event) => {
    if (event.buttons === 1 && !dom.close_button.matches(":hover") && !dom.add_button.matches(":hover")) {
        window.startDragging().catch((reason) => { console.error(reason) });
    }
});

switchMonthSelection(dom.this_month_button)
updateTitle()