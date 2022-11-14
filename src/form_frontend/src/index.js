import { form_backend } from "../../declarations/form_backend";

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.target.querySelector("button");

  const app_principal = document.getElementById("app_principal").value.toString();
  const app_account = document.getElementById("app_account").value.toString();
  const nns_principal = document.getElementById("nns_principal").value.toString();

  button.setAttribute("disabled", true);

  // Interact with foo actor, calling the greet method
  const response = await form_backend.create({app_principal, app_account, nns_principal});

  button.removeAttribute("disabled");

  document.getElementById("response").innerText = response;

  return false;
});
