// todo dialog for showing birthdays in a given day
// todo error handling.. lots of it
// todo get better at TypeScript..

import * as Dom from "./dom.ts";
import { getDaysInMonth, calculateOffset, months } from "./date.ts";
import { getCurrentWindow } from "@tauri-apps/api/window";

const window = getCurrentWindow();

function toggleDialog() {
    Dom.Dialog.dialog.open ? Dom.Dialog.dialog.close() : Dom.Dialog.dialog.show();
    Dom.calendar.classList.toggle("blurry");
    Dom.Footer.footer.classList.toggle("blurry");
}

function registerBirthday() {
    if (!Dom.Dialog.name_input.value || !Dom.Dialog.date_input.value) {
        void displayNotification("Incomplete...")
        return;
    }
    saveBirthday();
    Dom.Dialog.name_input.value = "";
    Dom.Dialog.date_input.value = "";
    void displayNotification("Saved!");
}

function getBirthdays() {
    // todo
}

function saveBirthday() {
    // todo
}

function updateHeader(): void {
    const date = new Date()
    Dom.Header.title.innerHTML = months[date.getMonth()] + " " + date.getDate();
}

async function displayNotification(text: string) {  // todo deal with this being a bit wonky
    Dom.Header.title.innerHTML = text;
    await new Promise(r => setTimeout(r, 2000));
    updateHeader();
}

function renderCalendar(date: Date, show_next_month?: boolean): void {
    if (show_next_month) { date.setMonth(date.getMonth()+1) }
    getBirthdays();
    const offset = calculateOffset(date);
    while (Dom.calendar.firstChild) { Dom.calendar.removeChild(Dom.calendar.firstChild) }
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
            Dom.calendar.append(row);
            row = document.createElement("tr");
        }
    }
    if (row.children) { Dom.calendar.append(row) }
}

function switchMonthSelection(button: HTMLElement): void {
    renderCalendar(new Date, button === Dom.Footer.next_month_button)
    if (button.classList.contains("selected")) { return }
    Dom.Footer.this_month_button.classList.toggle("selected")
    Dom.Footer.next_month_button.classList.toggle("selected")
}

Dom.Header.close_button.addEventListener("click", window.close);
Dom.Header.add_button.addEventListener("click", toggleDialog);
Dom.Footer.this_month_button.addEventListener("click", () => {switchMonthSelection(Dom.Footer.this_month_button)})
Dom.Footer.next_month_button.addEventListener("click", () => {switchMonthSelection(Dom.Footer.next_month_button)})
Dom.Dialog.submit_button.addEventListener("click", registerBirthday)

Dom.Header.header.addEventListener("mousedown", (event) => {
    if (event.buttons === 1 && !Dom.Header.close_button.matches(":hover") && !Dom.Header.add_button.matches(":hover")) {
        window.startDragging().catch((reason) => { console.error(reason) });
    }
});

switchMonthSelection(Dom.Footer.this_month_button)
updateHeader()