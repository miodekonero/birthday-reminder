import * as Dom from "./dom.ts";
import * as Dates from "./date.ts";
import { getCurrentWindow } from "@tauri-apps/api/window";

const window = getCurrentWindow();
let last_date = new Date;

namespace HeaderInterface {
    const notification_time = 1500;
    let last_notification = new Promise(() => {});

    export function set(text: string): void {
        Dom.Header.title.innerHTML = text;
        Dom.Header.title.classList.add("highlight");
    }

    export function reset(): void {
        set(Dates.month_name[last_date.getMonth()] + " " + last_date.getDate());
        Dom.Header.title.classList.remove("highlight");
    }

    export async function notify(text: string): Promise<void> {
        const notification = new Promise(_ => setTimeout(_, notification_time));
        set(text);
        Dom.Header.title.classList.add("highlight");
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

function submitBirthday(): void {
    const parsed_month = parseInt(Dom.Dialog.month_input.value);
    const parsed_day = parseInt(Dom.Dialog.day_input.value);
    const days_in_month = Dates.getDaysInMonth(parsed_month);
    if (
        !Dom.Dialog.name_input.value || !Dom.Dialog.name_input.value || !Dom.Dialog.month_input.value ||
        parsed_month < 1             || parsed_month > 12            ||
        parsed_day < 1               || parsed_day > days_in_month
    ) {
        void HeaderInterface.notify("Invalid...")
        return;
    }
    Dates.saveBirthday(parsed_day, parsed_month-1, Dom.Dialog.name_input.value);
    Dom.Dialog.name_input.value = "";
    Dom.Dialog.day_input.value = "";
    Dom.Dialog.month_input.value = "";
    void HeaderInterface.notify("Saved!");
    renderCalendar(Dom.Footer.next_month_button.classList.contains("selected"));
}

function renderCalendar(show_next_month?: boolean): void {
    last_date = new Date;
    const date = structuredClone(last_date);
    if (show_next_month) { date.setMonth(date.getMonth()+1) }

    const offset = Dates.calculateOffset(date.getMonth(), date.getFullYear());
    let row = document.createElement("tr");

    while (Dom.calendar.firstChild) { Dom.calendar.removeChild(Dom.calendar.firstChild) }
    for (let index = 0; index < offset; index++) { row.append(document.createElement("td")) }

    console.log(date.getMonth(), date.getDate())
    for (let index = 1; index <= Dates.getDaysInMonth(date.getMonth(), date.getFullYear()); index++) {
        const is_today = !show_next_month && date.getDate() == index;
        const birthdays = Dates.getBirthdays(index, date.getMonth());
        let cell = document.createElement("td");
        cell.innerHTML = index.toString();
        if (((offset + index - 1) % 7) > 4) {
            cell.classList.add("weekend")
        }

        if (birthdays.length) {
            const birthdays_string = birthdays.join(", ");
            if (birthdays_string.length > 16) {
                cell.addEventListener("mouseover", () => HeaderInterface.set("..."));
                cell.setAttribute("title", birthdays_string)
            }
            else {
                cell.addEventListener("mouseover", () => HeaderInterface.set(birthdays_string));
            }
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
Dom.Dialog.submit_button    .addEventListener("click", submitBirthday)

renderCalendar()
HeaderInterface.reset()