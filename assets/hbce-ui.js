(function(){
"use strict";

function inject(){

const header = `
<div class="topbar">
<div>
<div style="font-size:12px;color:#a7b4cc;letter-spacing:.15em;text-transform:uppercase">
HBCE R&D · HERMETICUM B.C.E.
</div>
<div style="font-size:12px;color:#a7b4cc">
EU-first · audit-first · fail-closed
</div>
</div>

<nav class="nav">
<a href="/">Home</a>
<a href="/about/">About</a>
<a href="/joker-c2/">Joker-C2</a>
<a href="/robotics-ai/">Robotics</a>
<a href="/pricing/">Pricing</a>
<a href="/operator/">Operator</a>
<a href="/eu/">EU</a>
<a href="/contact/">Contact</a>
</nav>
</div>
`;

const footer = `
<footer>
HERMETICUM - BLINDATA · COMPUTABILE · EVOLUTIVA<br>
HERMETICUM B.C.E. S.r.l. — EU jurisdiction<br>
HASH_ONLY · APPEND_ONLY · FAIL_CLOSED · UE_FIRST · AUDIT_FIRST
</footer>
`;

const wrapStart = `<div class="wrap">`;
const wrapEnd = `</div>`;

const body = document.body;

const content = body.innerHTML;

body.innerHTML =
wrapStart +
header +
content +
footer +
wrapEnd;

}

if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",inject);
}else{
inject();
}

})();
