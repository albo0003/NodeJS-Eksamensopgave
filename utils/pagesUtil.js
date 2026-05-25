import { readPage, constructPage } from "./templatingEngine.js";

const frontPage = readPage('./public/pages/FrontPage.html');
export const frontPagePage = constructPage(frontPage, {
    documentTitle: "StudyRoom"
});

const creditPage = readPage('./public/pages/CreditPage.html');
export const creditPagePage = constructPage(creditPage, {
    documentTitle: "Secret"
});
const LoginPage = readPage('./public/pages/LoginPage.html');
export const LoginPagePage = constructPage(LoginPage, {
    documentTitle: "Secret"
});