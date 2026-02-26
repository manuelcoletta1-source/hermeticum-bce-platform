function executeWithoutIdentity(){

  const result = {
    status: "BLOCKED",
    reason: "MISSING_IDENTITY",
    mode: "FAIL_CLOSED"
  };

  render(result);
}

function executeWithIdentity(){

  const ipr = {
    id: "IPR-DEMO-0001",
    integrity: "VALID",
    mode: "APPEND_ONLY",
    verification: "HASH_MATCH"
  };

  const result = {
    status: "AUTHORIZED",
    identity: ipr.id,
    integrity: ipr.integrity,
    mode: ipr.mode
  };

  render(result);
}

function render(data){
  document.getElementById("output").innerHTML =
    "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
}
