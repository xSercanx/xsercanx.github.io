document.documentElement.setAttribute('lang', navigator.language);
let language = document.documentElement.lang;
if (language[0] == "d" && language[1] == "e") {
    language = "de-DE";
} else {
    language = "en-US";
}
window.location.href = `${language}/index.html`;