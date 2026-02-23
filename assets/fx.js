/* ===============================
   HBCE FX LAYER (cinematic)
   =============================== */

:root{
  --fx-grain-opacity: .08;
  --fx-scan-opacity: .05;
}

/* master switches */
.fx-off *{
  animation:none !important;
  transition:none !important;
}
.fx-degraded .fx-heavy{
  display:none !important;
}

/* subtle grain + scanlines overlay */
body::before{
  content:"";
  position:fixed;
  inset:0;
  pointer-events:none;
  z-index:999;
  opacity:var(--fx-grain-opacity);
  mix-blend-mode:overlay;
  background-image:
    repeating-linear-gradient(0deg,
      rgba(255,255,255,var(--fx-scan-opacity)) 0px,
      rgba(255,255,255,0) 2px,
      rgba(0,0,0,0) 6px);
}

/* vignette */
body::after{
  content:"";
  position:fixed;
  inset:-2px;
  pointer-events:none;
  z-index:998;
  background:radial-gradient(ellipse at center,
    rgba(0,0,0,0) 55%,
    rgba(0,0,0,.55) 100%);
}

/* reveal */
[data-reveal]{
  opacity:0;
  transform:translateY(10px);
  transition:opacity .55s ease, transform .55s ease;
}
[data-reveal].is-revealed{
  opacity:1;
  transform:none;
}

/* glitch pulse — applied to root for a short time */
.fx-glitch .hbce-hero__title,
.fx-glitch h1,
.fx-glitch .hbce-brand{
  text-shadow:
    1px 0 rgba(255,0,80,.35),
   -1px 0 rgba(0,160,255,.25);
  transform:translateX(.5px);
}

/* micro shake */
.fx-shake{
  animation:hbceShake 220ms linear 1;
}
@keyframes hbceShake{
  0%{ transform:translate(0,0) }
  20%{ transform:translate(1px,0) }
  40%{ transform:translate(-1px,0) }
  60%{ transform:translate(1px,1px) }
  80%{ transform:translate(0,-1px) }
  100%{ transform:translate(0,0) }
}
