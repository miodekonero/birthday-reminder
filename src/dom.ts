const id = (content: string) => document.getElementById(content);

export const dialog            = id("dialog")! as HTMLDialogElement;

export const dialog_name       = id("dialog-name")! as HTMLInputElement;
export const dialog_date       = id("dialog-date")! as HTMLInputElement;

export const add_button        = id("add-button")! as HTMLButtonElement;
export const close_button      = id("close-button")! as HTMLButtonElement;
export const this_month_button = id("this-month-button")!;
export const next_month_button = id("next-month-button")!;
export const date_display      = id("date-display")!;
export const dialog_button     = id("dialog-button")!;

export const header            = id("header")! as HTMLDivElement;
export const calendar          = id("calendar")! as HTMLDivElement;
export const footer            = id("footer")! as HTMLDivElement;

// todo make the <p> "buttons" actual buttons