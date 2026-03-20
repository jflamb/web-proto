// TOC active-state highlighting via IntersectionObserver
(function () {
  var tocLinks = document.querySelectorAll('.prose-toc a[href^="#"]');
  if (!tocLinks.length) return;

  var sectionIds = Array.from(tocLinks).map(function (a) {
    return a.getAttribute('href').slice(1);
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          tocLinks.forEach(function (link) {
            link.classList.toggle(
              'prose-toc-active',
              link.getAttribute('href') === '#' + id
            );
          });
        }
      });
    },
    { rootMargin: '0px 0px -70% 0px', threshold: 0 }
  );

  sectionIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();

// Link hover glow — tracks mouse X position across each link
(function () {
  document.addEventListener('mousemove', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    var rect = link.getBoundingClientRect();
    var pct = ((e.clientX - rect.left) / rect.width) * 100;
    var spread = 30;
    link.style.setProperty('--glow-start', Math.max(0, pct - spread) + '%');
    link.style.setProperty('--glow-mid', pct + '%');
    link.style.setProperty('--glow-end', Math.min(100, pct + spread) + '%');
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.tagName === 'A') {
      e.target.style.removeProperty('--glow-start');
      e.target.style.removeProperty('--glow-mid');
      e.target.style.removeProperty('--glow-end');
    }
  });
})();

// Code block copy buttons
(function () {
  document.querySelectorAll('.prose pre').forEach(function (pre) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'prose-copy-btn';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.textContent = 'Copy';

    btn.addEventListener('click', function () {
      var code = pre.querySelector('code');
      var text = code ? code.textContent : pre.textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied!';
        btn.classList.add('prose-copy-btn-success');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('prose-copy-btn-success');
        }, 1500);
      });
    });

    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
})();