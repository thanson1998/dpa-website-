(() => {
  const money = n => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
  function parsePrice(text) {
    const values = (text.match(/\d[\d.]*/g) || []).map(x => Number(x.replaceAll('.', '')));
    return values.length ? [Math.min(...values), Math.max(...values)] : null;
  }
  const catalog = [...document.querySelectorAll('.dish-card')].map((card, i) => {
    const name = card.querySelector('h3').textContent;
    const price = card.querySelector('strong').textContent;
    const category = card.closest('section').querySelector('h2').textContent;
    return { id: String(i), card, name, price, category, range: parsePrice(price) };
  });
  const selected = new Map();
  try {
    const saved = JSON.parse(localStorage.getItem('dpa-menu-plan-v1') || '[]');
    if (Array.isArray(saved)) saved.forEach(([id, qty]) => {
      if (catalog[Number(id)] && Number.isInteger(qty) && qty > 0 && qty <= 999) selected.set(String(id), qty);
    });
  } catch (_) {}
  const dock = document.createElement('button');
  dock.className = 'plan-dock'; dock.type = 'button'; dock.setAttribute('aria-haspopup', 'dialog');
  const dialog = document.createElement('dialog');
  dialog.className = 'plan-dialog'; dialog.setAttribute('aria-labelledby', 'plan-title');
  dialog.innerHTML = `<div class="plan-heading"><div><span class="eyebrow">CÙNG NHAU CHỌN MÓN NGON</span><h2 id="plan-title">Thực đơn dự kiến</h2></div><button type="button" class="plan-close" aria-label="Đóng thực đơn dự kiến">×</button></div><p class="plan-help">Chọn số lượng theo đơn vị trên menu (con, đĩa, âu hoặc kg). Món không ghi đơn vị được tính theo phần.</p><div class="plan-items"></div><div class="plan-summary" aria-live="polite"></div><div class="plan-actions"><button type="button" class="plan-continue">Chọn thêm món</button><a href="tel:0967986768">Gọi đặt bàn</a></div><p class="plan-help">Đây là dự toán để tham khảo, chưa phải đơn đặt món. Giá thực tế được nhà hàng xác nhận khi đặt bàn.</p>`;
  const status = document.createElement('div'); status.className = 'plan-status'; status.setAttribute('role', 'status');
  document.body.append(dock, dialog, status);
  const items = dialog.querySelector('.plan-items');
  const summary = dialog.querySelector('.plan-summary');
  const messengerButton = document.createElement('button');
  messengerButton.type = 'button'; messengerButton.className = 'plan-messenger'; messengerButton.textContent = 'Gửi qua Messenger';
  dialog.querySelector('.plan-actions').append(messengerButton);
  const sharePanel = document.createElement('div'); sharePanel.className = 'plan-share'; sharePanel.hidden = true;
  const shareNote = document.createElement('p'); shareNote.setAttribute('role', 'status');
  const shareText = document.createElement('textarea'); shareText.readOnly = true; shareText.rows = 7; shareText.setAttribute('aria-label', 'Nội dung thực đơn để gửi qua Messenger');
  const messengerLink = document.createElement('a'); messengerLink.href = 'https://m.me/trainghiemdpathainguyen'; messengerLink.target = '_blank'; messengerLink.rel = 'noopener noreferrer'; messengerLink.textContent = 'Mở Messenger nhà hàng';
  sharePanel.append(shareNote, shareText, messengerLink); dialog.append(sharePanel);
  messengerButton.onclick = async () => {
    if (!selected.size) return;
    let low = 0, high = 0, unknown = 0;
    const lines = ['THỰC ĐƠN DỰ KIẾN — KHU TRẢI NGHIỆM DPA', 'Xin chào nhà hàng, tôi muốn được tư vấn thực đơn sau:', ''];
    selected.forEach((qty, id) => {
      const item = catalog[Number(id)];
      lines.push(`${lines.length - 2}. ${item.name} (${item.category}) — SL: ${qty} — Đơn giá: ${item.price} — Thành tiền: ${item.range ? format(item.range[0] * qty, item.range[1] * qty) : 'Cần báo giá'}`);
      if (item.range) { low += item.range[0] * qty; high += item.range[1] * qty; } else unknown += qty;
    });
    lines.push('', `${unknown ? 'Tạm tính các món đã có giá' : 'Tổng tiền dự kiến'}: ${format(low, high)}`);
    if (unknown) lines.push(`${unknown} lựa chọn cần báo giá, chưa cộng vào tổng.`);
    lines.push('Số lượng theo đơn vị trên menu; món không ghi đơn vị tính theo phần.', 'Nhờ nhà hàng xác nhận giá và tư vấn đặt bàn.');
    shareText.value = lines.join('\n'); sharePanel.hidden = false;
    shareText.focus(); shareText.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    if (!copied) { try { await navigator.clipboard.writeText(shareText.value); copied = true; } catch (_) {} }
    shareNote.textContent = copied ? 'Đã sao chép thực đơn. Mở Messenger bên dưới, dán nội dung rồi nhấn Gửi.' : 'Hãy sao chép nội dung bên dưới, mở Messenger rồi dán và gửi cho nhà hàng.';
  };
  const printButton = document.createElement('button');
  printButton.type = 'button'; printButton.className = 'plan-print'; printButton.textContent = 'In thực đơn';
  dialog.querySelector('.plan-heading').append(printButton);
  printButton.onclick = () => {
    if (!selected.size) return;
    const sheet = document.createElement('section');
    sheet.className = 'plan-print-sheet';
    const brand = document.createElement('h1'); brand.textContent = 'KHU TRẢI NGHIỆM DPA';
    const contact = document.createElement('p'); contact.textContent = 'Km9 Hóa Trung, Đồng Hỷ, Thái Nguyên · 0967 986 768';
    const title = document.createElement('h2'); title.textContent = 'THỰC ĐƠN DỰ KIẾN';
    const list = items.cloneNode(true);
    list.querySelectorAll('.plan-controls').forEach(control => {
      const qty = control.querySelector('span').textContent;
      control.replaceChildren(); control.textContent = 'Số lượng: ' + qty;
    });
    const note = document.createElement('p'); note.textContent = 'Số lượng theo đơn vị ghi trên menu; món không ghi đơn vị tính theo phần. Giá dự kiến để tham khảo, nhà hàng xác nhận khi đặt bàn.';
    sheet.append(brand, contact, title, list, summary.cloneNode(true), note);
    document.body.append(sheet);
    dialog.close(); document.body.classList.remove('plan-open');
    document.body.classList.add('printing-plan');
    try { window.print(); } finally {
      document.body.classList.remove('printing-plan'); sheet.remove();
      dialog.showModal(); document.body.classList.add('plan-open');
    }
  };
  const close = () => { dialog.close(); document.body.classList.remove('plan-open'); };
  dock.onclick = () => { dialog.showModal(); document.body.classList.add('plan-open'); };
  dialog.querySelector('.plan-close').onclick = close;
  dialog.querySelector('.plan-continue').onclick = close;
  dialog.addEventListener('close', () => document.body.classList.remove('plan-open'));
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); } });
  function change(id, delta) {
    const next = (selected.get(id) || 0) + delta;
    if (next > 999) return;
    if (next <= 0) selected.delete(id); else selected.set(id, next);
    render();
  }
  const format = (low, high) => low === high ? money(low) : `${money(low)} – ${money(high)}`;
  function render() {
    sharePanel.hidden = true;
    items.replaceChildren();
    let low = 0, high = 0, count = 0, unknown = 0;
    selected.forEach((qty, id) => {
      const item = catalog[Number(id)]; count += qty;
      if (item.range) { low += item.range[0] * qty; high += item.range[1] * qty; } else unknown += qty;
      const row = document.createElement('div'); row.className = 'plan-row';
      const title = document.createElement('h3'); title.textContent = item.name;
      const detail = document.createElement('p'); detail.className = 'plan-item-detail'; detail.textContent = `${item.category} · ${item.price}`;
      const subtotal = document.createElement('strong'); subtotal.textContent = item.range ? format(item.range[0] * qty, item.range[1] * qty) : 'Cần báo giá';
      const controls = document.createElement('div'); controls.className = 'plan-controls';
      const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', 'Giảm số lượng ' + item.name); minus.onclick = () => change(id, -1);
      const number = document.createElement('span'); number.textContent = qty; number.setAttribute('aria-label', 'Số lượng ' + qty);
      const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', 'Tăng số lượng ' + item.name); plus.disabled = qty >= 999; plus.onclick = () => change(id, 1);
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'plan-remove'; remove.textContent = 'Bỏ món'; remove.onclick = () => { selected.delete(id); render(); };
      controls.append(minus, number, plus, remove); row.append(title, detail, subtotal, controls); items.append(row);
    });
    if (!count) { const empty = document.createElement('p'); empty.className = 'plan-empty'; empty.textContent = 'Chưa có món nào. Nhấn dấu + cạnh món bạn thích để tạo thực đơn.'; items.append(empty); }
    printButton.disabled = !count;
    messengerButton.disabled = !count;
    summary.replaceChildren();
    const label = document.createElement('span'); label.textContent = unknown ? 'Tạm tính các món đã có giá' : 'Tổng tiền dự kiến';
    const total = document.createElement('strong'); total.textContent = format(low, high);
    summary.append(label, total);
    if (unknown) { const note = document.createElement('p'); note.textContent = `${unknown} lựa chọn chưa có giá, chưa được cộng vào tổng. Vui lòng liên hệ nhà hàng.`; summary.append(note); }
    dock.textContent = `Thực đơn dự kiến (${count}) · ${format(low, high)}${unknown ? ' + món cần báo giá' : ''}`;
    catalog.forEach(item => { const qty = selected.get(item.id) || 0; item.card.classList.toggle('dish-selected', qty > 0); item.button.setAttribute('aria-label', `Thêm ${item.name} vào thực đơn dự kiến${qty ? ', đã chọn ' + qty : ''}`); item.button.title = qty ? `Đã chọn ${qty}. Nhấn để thêm.` : 'Thêm vào thực đơn dự kiến'; });
    try { localStorage.setItem('dpa-menu-plan-v1', JSON.stringify([...selected])); } catch (_) {}
  }
  catalog.forEach(item => {
    const button = document.createElement('button'); button.className = 'dish-add'; button.type = 'button'; button.textContent = '+';
    button.onclick = () => { change(item.id, 1); status.textContent = `Đã thêm ${item.name} vào thực đơn dự kiến.`; };
    item.card.append(button); item.button = button;
  });
  render();
})();
