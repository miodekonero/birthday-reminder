export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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