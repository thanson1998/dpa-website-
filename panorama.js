(() => {
  const host = document.getElementById('dpa-panorama');
  const start = document.getElementById('panorama-start');
  const status = document.getElementById('panorama-status');
  const full = document.getElementById('panorama-fullscreen');
  let viewer;
  let loading = false;
  function resource(tag, url) {
    return new Promise((resolve, reject) => {
      const el = document.createElement(tag);
      const timer = setTimeout(() => { el.remove(); reject(new Error('timeout')); }, 20000);
      el.onload = () => { clearTimeout(timer); resolve(); };
      el.onerror = () => { clearTimeout(timer); el.remove(); reject(new Error('network')); };
      if (tag === 'link') { el.rel = 'stylesheet'; el.href = url; } else el.src = url;
      document.head.append(el);
    });
  }
  start.addEventListener('click', async () => {
    if (loading || viewer) return;
    loading = true; start.disabled = true; status.textContent = 'Đang tải không gian 360°…';
    try {
      await Promise.all([
        resource('link', 'https://cdn.jsdelivr.net/npm/pannellum@2.5.7/build/pannellum.css'),
        resource('script', 'https://cdn.jsdelivr.net/npm/pannellum@2.5.7/build/pannellum.js')
      ]);
      viewer = window.pannellum.viewer(host, {
        type: 'equirectangular', panorama: 'assets/dpa-panorama.jpg',
        autoLoad: true, pitch: -25, yaw: 0, hfov: 100, minHfov: 45, maxHfov: 120,
        mouseZoom: 'fullscreenonly', showFullscreenCtrl: false, escapeHTML: true,
        strings: { loadingLabel: 'Đang tải…', bylineLabel: 'DPA', loadButtonLabel: 'Xem 360°',
          genericWebGLError: 'Không thể hiển thị 360° trên thiết bị này. Bạn có thể mở ảnh toàn cảnh bên dưới.',
          fileAccessError: 'Không tải được ảnh toàn cảnh. Vui lòng thử lại.', noWebGLError: 'Thiết bị chưa hỗ trợ xem 360°. Hãy mở ảnh toàn cảnh bên dưới.' }
      });
      viewer.on('load', () => { start.hidden = true; loading = false; full.disabled = false; status.textContent = 'Kéo để xoay góc nhìn · Dùng nút + / − để phóng to, thu nhỏ.'; });
      viewer.on('error', () => { loading = false; status.textContent = 'Chưa tải được chế độ 360°. Bạn có thể mở ảnh toàn cảnh bên dưới.'; });
    } catch (_) {
      loading = false; start.disabled = false; status.textContent = 'Kết nối chưa sẵn sàng. Nhấn Xem 360° để thử lại hoặc mở ảnh bên dưới.';
    }
  });
  full.addEventListener('click', () => {
    if (!viewer) return;
    if (document.fullscreenEnabled) viewer.toggleFullscreen();
    else { host.classList.toggle('panorama-expanded'); viewer.resize(); status.textContent = 'Đã đổi kích thước khung xem. Nhấn Toàn màn hình lần nữa để thu gọn.'; }
  });
})();
