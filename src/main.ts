// todo dialog for showing birthdays in a given day
// todo error handling.. lots of it
// todo get better at TypeScript..

import * as Dom from "./dom.ts";
import { getDaysInMonth, calculateOffset, months } from "./date.ts";
import { getCurrentWindow } from "@tauri-apps/api/window";

const window = getCurrentWindow();
let last_date = new Date;

namespace HeaderInterface {
    const notification_time = 1500;
    let last_notification = new Promise(() => {});

    export function set(text: string): void {
        Dom.Header.title.innerHTML = text;
    }

    export function reset(): void {
        set(months[last_date.getMonth()] + " " + last_date.getDate());
    }

    export async function notify(text: string): Promise<void> {
        const notification = new Promise(_ => setTimeout(_, notification_time));
        set(text);
        last_notification = notification;
        await notification;
        if (last_notification === notification) {
            reset();
        }
    }
}

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
        void HeaderInterface.notify("Invalid...")
        return;
    }
    Dom.Dialog.name_input.value = "";
    Dom.Dialog.date_input.value = "";
    void HeaderInterface.notify("Saved!");
    // todo
}

function renderCalendar(show_next_month?: boolean): void {
    last_date = new Date;
    if (show_next_month) { last_date.setMonth(last_date.getMonth()+1) }
    const offset = calculateOffset(last_date);
    while (Dom.calendar.firstChild) { Dom.calendar.removeChild(Dom.calendar.firstChild) }
    let row = document.createElement("tr");
    for (let index = 0; index < offset; index++) { row.append(document.createElement("td")) }
    for (let index = 1; index <= getDaysInMonth(last_date); index++) {
        let cell = document.createElement("td");
        cell.innerHTML = index.toString();
        if (((offset + index - 1) % 7) > 4) {
            cell.classList.add("weekend")
        }
        const is_today = !show_next_month && last_date.getDate() == index;
        const birthdays = [];  // todo
        if (birthdays.length) {
            cell.addEventListener("mouseover", () => HeaderInterface.set("TODO"));  // todo
            cell.addEventListener("mouseleave", HeaderInterface.reset);
        }

        if (is_today && birthdays.length) { cell.classList.add("highlight-gradient") }
        else if (is_today) { cell.classList.add("highlight") }
        else if (birthdays.length) { cell.classList.add("gradient") }

        row.append(cell);
        if ((offset + index) % 7 === 0) {
            Dom.calendar.append(row);
            row = document.createElement("tr");
        }
    }
    if (row.children) { Dom.calendar.append(row) }
}

function switchMonthSelection(this: HTMLButtonElement): void {
    if (this.classList.contains("selected")) { return }
    renderCalendar(this === Dom.Footer.next_month_button)
    Dom.Footer.this_month_button.classList.toggle("selected")
    Dom.Footer.next_month_button.classList.toggle("selected")
}

Dom.Header.header           .addEventListener("mousedown", dragWindow)
Dom.Header.close_button     .addEventListener("click", window.close);
Dom.Header.add_button       .addEventListener("click", toggleDialog);
Dom.Footer.this_month_button.addEventListener("click", switchMonthSelection)
Dom.Footer.next_month_button.addEventListener("click", switchMonthSelection)
Dom.Dialog.submit_button    .addEventListener("click", registerBirthday)

renderCalendar()
HeaderInterface.reset()