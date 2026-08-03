const id = (content: string) => document.getElementById(content);

export namespace Dialog {
    export const dialog            = id("dialog")! as HTMLDialogElement;
    export const name_input        = id("dialog-name")! as HTMLInputElement;
    export const date_input        = id("dialog-date")! as HTMLInputElement;
    export const submit_button     = id("dialog-button")! as HTMLButtonElement;
}

export namespace Header {
    export const header            = id("header")! as HTMLDivElement;
    export const add_button        = id("add-button")! as HTMLButtonElement;
    export const close_button      = id("close-button")! as HTMLButtonElement;
    export const title             = id("date-display")!;
}

export namespace Footer {
    export const footer            = id("footer")! as HTMLDivElement;
    export const this_month_button = id("this-month-button")! as HTMLButtonElement;
    export const next_month_button = id("next-month-button")! as HTMLButtonElement;
}

export const calendar = id("calendar")! as HTMLDivElement;