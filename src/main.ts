// todo dialog for showing birthdays in a given day
// todo error handling.. lots of it
// todo get better at TypeScript..

import * as Dom from "./dom.ts";
import { getDaysInMonth, calculateOffset, months } from "./date.ts";
import { getCurrentWindow } from "@tauri-apps/api/window";

const window = getCurrentWindow();
let global_notif_promise: Promise<unknown> = new Promise(() => {});

function dragWindow(event: MouseEvent): void {
    if (event.buttons === 1 && !Dom.Header.close_button.matches(":hover") && !Dom.Header.add_button.matches(":hover")) {
        window.startDragging().catch((reason) => { console.error(reason) });
    }
}

function toggleDialog(): void {
    Dom.Dialog.dialog.open ? Dom.Dialog.dialog.close() : Dom.Dialog.dialog.show();
    Dom.calendar.classList.toggle("blurry");
    Dom.Footer.footer.classList.toggle("blurry");
}

function registerBirthday(): void {
    if (!Dom.Dialog.name_input.value || !Dom.Dialog.date_input.value) {
        void displayNotification("Incomplete...")
        return;
    }
    saveBirthday();
    Dom.Dialog.name_input.value = "";
    Dom.Dialog.date_input.value = "";
    void displayNotification("Saved!");
}

function getBirthdays(): void {
    // todo
}

function saveBirthday(): void {
    // todo
}

function updateHeader(): void {
    const date = new Date()
    Dom.Header.title.innerHTML = months[date.getMonth()] + " " + date.getDate();
}

async function displayNotification(text: string): Promise<void> {
    Dom.Header.title.innerHTML = text;
    const local_notif_promise = new Promise(r => setTimeout(r, 1500));
    global_notif_promise = local_notif_promise;
    await local_notif_promise;
    if (global_notif_promise === local_notif_promise) {  // checking if the function "owns" the notification
        updateHeader()                                   // to avoid the title bar flashing when spamming notifications
    }
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

function switchMonthSelection(this: HTMLButtonElement): void {
    renderCalendar(new Date, this === Dom.Footer.next_month_button)
    if (this.classList.contains("selected")) { return }
    Dom.Footer.this_month_button.classList.toggle("selected")
    Dom.Footer.next_month_button.classList.toggle("selected")
}

Dom.Header.header           .addEventListener("mousedown", dragWindow)
Dom.Header.close_button     .addEventListener("click", window.close);
Dom.Header.add_button       .addEventListener("click", toggleDialog);
Dom.Footer.this_month_button.addEventListener("click", switchMonthSelection)
Dom.Footer.next_month_button.addEventListener("click", switchMonthSelection)
Dom.Dialog.submit_button    .addEventListener("click", registerBirthday)

renderCalendar(new Date(), false)
updateHeader()