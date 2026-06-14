// ── Nav toggle ────────────────────────────────────────────
(function () {
  var navToggle = document.getElementById("navToggle");
  var navList   = document.querySelector(".nav-list");
  var navClose  = document.querySelector(".nav-close");
  if (!navList) return;

  function openNav() {
    navList.classList.add("open");
    document.body.classList.add("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "true");
  }
  function closeNav() {
    navList.classList.remove("open");
    document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle) navToggle.addEventListener("click", function () {
    navList.classList.contains("open") ? closeNav() : openNav();
  });

  if (navClose) navClose.addEventListener("click", closeNav);

  // Close when a nav link is tapped — let browser navigate naturally
  navList.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  // Close on outside tap
  document.addEventListener("click", function (e) {
    if (!navList.classList.contains("open")) return;
    if (!navList.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });
})();

// ── Header scroll effect ──────────────────────────────────
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;
  function check() { header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", check, { passive: true });
  check();
})();

// ── Active nav highlight ──────────────────────────────────
(function () {
  function setActive() {
    var current = window.location.href.split("?")[0].split("#")[0];
    document.querySelectorAll(".nav-list a").forEach(function (link) {
      // resolve the href to an absolute URL for comparison
      var resolved = link.href.split("?")[0].split("#")[0];
      link.classList.toggle("active", resolved === current);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setActive);
  } else {
    setActive();
  }
})();

// ── Footer reveal ─────────────────────────────────────────
(function () {
  var footer = document.querySelector(".site-footer");
  if (!footer) return;
  // Immediately show footer if IntersectionObserver not supported
  if (!window.IntersectionObserver) {
    footer.classList.add("footer-visible");
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      footer.classList.add("footer-visible");
      io.disconnect();
    }
  }, { threshold: 0.05 });
  io.observe(footer);
})();

// ── Custom cursor ─────────────────────────────────────────
(function () {
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;
  try {
    var wrap = document.createElement("div"); wrap.className = "custom-cursor";
    var ring = document.createElement("div"); ring.className = "cursor-ring";
    var dot  = document.createElement("div"); dot.className  = "cursor-dot";
    wrap.appendChild(ring); wrap.appendChild(dot);
    document.body.appendChild(wrap);
    document.documentElement.classList.add("has-custom-cursor");
    var mx = innerWidth/2, my = innerHeight/2, dx = mx, dy = my, rx = mx, ry = my;
    document.addEventListener("mousemove", function(e){ mx=e.clientX; my=e.clientY; }, {passive:true});
    (function raf(){
      dx+=(mx-dx)*0.28; dy+=(my-dy)*0.28; rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
      dot.style.left=Math.round(dx)+"px"; dot.style.top=Math.round(dy)+"px";
      ring.style.left=Math.round(rx)+"px"; ring.style.top=Math.round(ry)+"px";
      requestAnimationFrame(raf);
    })();
    document.querySelectorAll("a,button,.btn").forEach(function(el){
      el.addEventListener("mouseenter",function(){ wrap.classList.add("cursor--hover"); });
      el.addEventListener("mouseleave",function(){ wrap.classList.remove("cursor--hover"); });
    });
  } catch(e) {}
})();

// ── Preloader ─────────────────────────────────────────────
(function () {
  try {
    var pre = document.createElement("div");
    pre.className = "preloader";
    pre.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0f0e2a;background:linear-gradient(135deg,#0f0e2a 0%,#1e1b4a 60%,#2a2473 100%);display:flex;align-items:center;justify-content:center;z-index:210000;";

    var scriptEl = document.querySelector('script[src*="script.js"]');
    var base = scriptEl ? scriptEl.src.replace(/\/js\/script\.js.*$/i, "") : "";
    var logoSrc = base ? base + "/images/Happiness_logo.png" : "assets/images/Happiness_logo.png";

    pre.innerHTML = [
      '<div class="pre-inner">',
      '  <div class="pre-ring" aria-hidden="true">',
      '    <div class="pre-ring-overlay"></div>',
      '    <img class="pre-logo-img" src="' + logoSrc + '" alt="" />',
      '  </div>',
      '  <div class="pre-text">LOADING<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>',
      '</div>'
    ].join("");

    document.documentElement.appendChild(pre);
    document.documentElement.classList.add("has-preloader");
    if (document.body) document.body.classList.add("has-preloader");

    var t0 = Date.now();
    function hide() {
      var wait = Math.max(0, 2500 - (Date.now() - t0));
      setTimeout(function () {
        pre.classList.add("hide");
        setTimeout(function () {
          pre.remove();
          document.documentElement.classList.remove("has-preloader");
          if (document.body) document.body.classList.remove("has-preloader");
        }, 400);
      }, wait);
    }
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide);
    setTimeout(hide, 12000);
  } catch(e) {}
})();

// ── Hero typewriter ───────────────────────────────────────
(function () {
  function init() {
    var h1 = document.querySelector(".hero-inner h1");
    if (!h1) return;
    var text = h1.textContent.replace(/\s+/g, " ").trim();
    h1.innerHTML = "";
    var typed = document.createElement("span"); typed.className = "typed";
    var cursor = document.createElement("span"); cursor.className = "typewriter-cursor";
    h1.appendChild(typed); h1.appendChild(cursor);
    var i = 0, fwd = true;
    function tick() {
      if (fwd) {
        if (i < text.length) { typed.textContent += text[i++]; setTimeout(tick, 55 + Math.random()*90); }
        else setTimeout(function(){ fwd=false; tick(); }, 1000);
      } else {
        if (i > 0) { typed.textContent = text.slice(0, --i); setTimeout(tick, 30 + Math.random()*40); }
        else setTimeout(function(){ fwd=true; tick(); }, 500);
      }
    }
    tick();
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

// ── Contact form ──────────────────────────────────────────
(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var n = (form.querySelector('[name="name"]') || {}).value || "";
    var em = (form.querySelector('[name="email"]') || {}).value || "";
    var msg = (form.querySelector('[name="message"]') || {}).value || "";
    if (!n.trim() || !em.trim() || !msg.trim()) { alert("Please complete all fields."); return; }
    alert("Thanks, " + n.trim() + "! Your message has been received.");
    form.reset();
  });
})();

// ── Scroll reveal ─────────────────────────────────────────
(function () {
  if (!window.IntersectionObserver) return;
  var sel = ".hero-inner,.about-image,.about-content,.project-media,.project-text,.card,.cta-inner,.contact-form,.service-card,.skills-list,.intro-text,.intro-media,.features-section .card";
  function init() {
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add("reveal");
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { el.classList.add("in-view"); obs.disconnect(); }
      }, { threshold: 0.1 }).observe(el);
    });
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
