# Birthday reminder
A minimalistic webview calendar for keeping track of birthdays. Built in [TypeScript](https://www.typescriptlang.org/) via [Tauri v2](https://v2.tauri.app/).
## Compilation
```
npm install
npm run tauri build
```
### Requirements
- [npm](https://www.npmjs.com/)
- [rust](https://rust-lang.org/learn/get-started/)
## Installation
Get the executable from the releases tab. The program can be stored and launched from any directory.
## Usage
Navigate the calendar by switching between the `This month` and `Next month` buttons in the footer.
Add birthdays by clicking the `[+]` button. Once there are any birthdays in the selected month, they will be marked by the gradient - hover on the date, to see whose birthday is it.

Birthdays are saved locally in `%appdata%/birthday-reminder/birthdays.data`. Each line is one entry, stored in the format `[day] [month] [name]`- separated by spaces - where:
- **Each day** is an integer
- **Each month** is a roman numeral 1 through 12, either uppercase or lowercase
- **Each name** is a regular string: they can contain spaces, and it's recommended for them to be under 16 characters.
## Screenshots
![](/screenshots/main.png)
![](/screenshots/dialog.png)
