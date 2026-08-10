# Birthday reminder
A minimalistic webview calendar for keeping track of birthdays. Built in TypeScript via Tauri.
## Compilation
```
npm install
npm run tauri build
```
## Installation
Get the executable from the releases tab. The program can be stored and launched from any directory.
## Usage
Add birthdays by clicking the `[+]` button. Once there are any birthdays in the selected month, they will be marked by the gradient - hover on the date, to see whose birthday is it.
Birthdays are saved locally in `%appdata%/birthday-reminder/birthdays.data`. Modifying this file isn't recommended, as error handling isn't implemented at this moment.
## Screenshots
![](/screenshots/main.png)
![](/screenshots/dialog.png)