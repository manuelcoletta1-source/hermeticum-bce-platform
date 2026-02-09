async function loadHBCE(){
  const header = await fetch("/hermeticum-bce-platform/assets/header.html").then(r=>r.text());
  const footer = await fetch("/hermeticum-bce-platform/assets/footer.html").then(r=>r.text());

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);
}

loadHBCE();
