// Draws the ContentTrace "signal trace" line into every <svg class="trace" data-seed="..."> on the page.
// The seed (use the post slug) makes each post's line unique but repeatable.
(function () {
  function rng(seed) {
    let h = 2166136261;
    for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  }
  document.querySelectorAll("svg.trace").forEach((svg, i) => {
    const w = +svg.getAttribute("width"), hgt = +svg.getAttribute("height");
    const r = rng((svg.dataset.seed || "contenttrace") + i);
    const base = hgt * 0.62;
    let x = 0, d = `M0 ${base}`;
    while (x < w) {
      x += 90 + r() * 140;
      if (x > w) break;
      d += ` H${x.toFixed(0)}`;
      if (r() < 0.35) { d += ` l6 -7 6 7`; x += 12; }
      else { const a = 14 + r() * 32, b = 18 + r() * 40; d += ` l8 ${-a.toFixed(0)} 9 ${(a + b).toFixed(0)} 8 ${-(b * 0.6).toFixed(0)} 6 ${(b * 0.0).toFixed(0)}`; x += 31; d += ` V${base}`; }
    }
    d += ` H${w}`;
    const id = "tg" + i;
    svg.innerHTML = `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#570d9e"/><stop offset="1" stop-color="#ec4860"/></linearGradient></defs>` +
      `<path d="${d}" fill="none" stroke="url(#${id})" stroke-width="2.5" stroke-linejoin="round" opacity="0.9"/>`;
  });
})();
