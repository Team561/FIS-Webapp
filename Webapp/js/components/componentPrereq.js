/*
Lit-html tag override so they don't throw errors
Should probably be removed in production, but it's largely harmless
(jquery's html() is called on a selector, so there is no conflict)
*/
// EDIT: using this breaks template literals, so only temporarily use it in such cases
function html(str){return str};
