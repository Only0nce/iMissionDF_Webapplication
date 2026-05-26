(() => {
  const API_BASE = String(window.WIFI_API_URL || 'api.php');

  const netList = document.getElementById('netList');
  const overlay = document.getElementById('overlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalSub = document.getElementById('modalSub');
  const modalError = document.getElementById('modalError');
  const pwd = document.getElementById('pwd');
  const showPwd = document.getElementById('showPwd');

  const wifiToggle = document.getElementById('wifiToggle');
  const askToggle = document.getElementById('askToggle');
  const refreshBtn = document.getElementById('refreshBtn');
  const joinBtn = document.getElementById('joinBtn');
  const pageMessage = document.getElementById('wifiPageMessage');
  const deviceLabel = document.getElementById('wifiDeviceLabel');
  const currentNetworkLabel = document.getElementById('wifiCurrentNetworkLabel');
  const ipLabel = document.getElementById('wifiIpLabel');
  const gatewayLabel = document.getElementById('wifiGatewayLabel');
  const netmaskLabel = document.getElementById('wifiNetmaskLabel');
  const wifiEditBtn = document.getElementById('wifiEditBtn');
  const wifiStatusBadge = document.getElementById('wifiStatusBadge');
  const networkSummaryLabel = document.getElementById('wifiNetworkSummary');
  const lteSimStatusLabel = document.getElementById('lteSimStatusLabel');
  const lteOperatorLabel = document.getElementById('lteOperatorLabel');
  const lteSignalLabel = document.getElementById('lteSignalLabel');
  const lteRegistrationLabel = document.getElementById('lteRegistrationLabel');
  const lteImeiLabel = document.getElementById('lteImeiLabel');
  const lteIccidLabel = document.getElementById('lteIccidLabel');
  const lteIpLabel = document.getElementById('lteIpLabel');
  const lteGatewayLabel = document.getElementById('lteGatewayLabel');
  const lteInterfaceLabel = document.getElementById('lteInterfaceLabel');
  const lteFlagsLabel = document.getElementById('lteFlagsLabel');
  const lteIpv6Label = document.getElementById('lteIpv6Label');
  const lteAddressLabel = document.getElementById('lteAddressLabel');
  const ltePacketsLabel = document.getElementById('ltePacketsLabel');
  const lteBytesLabel = document.getElementById('lteBytesLabel');
  const lteMtuQueueLabel = document.getElementById('lteMtuQueueLabel');
  const lteStatusNote = document.getElementById('lteStatusNote');

  const advOverlay = document.getElementById('advOverlay');
  const advTitle = document.getElementById('advTitle');
  const advSub = document.getElementById('advSub');
  const dnsAutoToggle = document.getElementById('dnsAutoToggle');
  const dnsInput = document.getElementById('dnsInput');
  const advClose = document.getElementById('advClose');
  const advCancel = document.getElementById('advCancelBtn');
  const advSave = document.getElementById('advSaveBtn');
  const advDisconnect = document.getElementById('advDisconnectBtn');
  const addrIp = document.getElementById('addrIp');
  const addrMask = document.getElementById('addrMask');
  const addrGw = document.getElementById('addrGw');
  const addrDel = document.getElementById('addrDel');
  const currentIpLabel = document.getElementById('currentIpLabel');

const ASK_JOIN_STORAGE_KEY = 'wifi.askJoinNetworks';
const AUTO_REFRESH_MS = 10000;
const BANNER_HIDE_MS = 10000;

let refreshTimerId = null;
let bannerHideTimerId = null;
let inFlight = false;
  let networks = [];
  let wifiEnabled = true;
  let currentDevice = '';
  let currentActiveSsid = '';
  const rowMap = new Map();

  function networkKey(n) {
    if (!n || typeof n !== 'object') return '';
    return String(n.key || n.bssid || `${n.ssid || ''}|${n.frequency || ''}|${n.channel || ''}`);
  }

  function apiUrl(action, params = {}) {
    const url = new URL(API_BASE, window.location.href);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
    return url.toString();
  }

  async function parseJsonResponse(res) {
    let json;
    try {
      json = await res.json();
    } catch (err) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    if (!res.ok || !json.ok) {
      throw new Error(json?.msg || json?.error || `HTTP ${res.status}`);
    }
    return json;
  }

  function escHtml(s) {
    return String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function prefixToMask(prefix) {
    const p = Math.max(0, Math.min(32, Number(prefix) || 0));
    let bits = '';
    for (let i = 0; i < 32; i++) bits += (i < p ? '1' : '0');
    const octets = [];
    for (let i = 0; i < 4; i++) {
      octets.push(parseInt(bits.slice(i * 8, (i + 1) * 8), 2));
    }
    return octets.join('.');
  }

  function setToggle(el, on) {
    if (!el) return;
    el.classList.toggle('on', !!on);
    el.setAttribute('aria-checked', String(!!on));
  }

  function bindToggle(el, onChange) {
    if (!el) return;
    el.addEventListener('click', () => {
      const next = !el.classList.contains('on');
      setToggle(el, next);
      if (typeof onChange === 'function') onChange(next);
    });
  }

  function isAnyModalOpen() {
    return overlay?.classList.contains('show') || advOverlay?.classList.contains('show');
  }

  function startAutoRefresh() {
    stopAutoRefresh();
    if (!wifiEnabled) return;
    refreshTimerId = setInterval(() => {
      if (document.hidden) return;
      if (isAnyModalOpen()) return;
      if (inFlight) return;
      loadNetworks({ silent: true });
    }, AUTO_REFRESH_MS);
  }

  function stopAutoRefresh() {
    if (refreshTimerId) {
      clearInterval(refreshTimerId);
      refreshTimerId = null;
    }
  }

function showBanner(message = '', tone = 'neutral') {
  if (!pageMessage) return;

  if (bannerHideTimerId) {
    clearTimeout(bannerHideTimerId);
    bannerHideTimerId = null;
  }

  if (!message) {
    pageMessage.className = 'wifi-banner d-none';
    pageMessage.innerHTML = '';
    return;
  }

  pageMessage.className = `wifi-banner wifi-banner-${tone}`;
  pageMessage.innerHTML = escHtml(message);

  bannerHideTimerId = setTimeout(() => {
    pageMessage.className = 'wifi-banner d-none';
    pageMessage.innerHTML = '';
    bannerHideTimerId = null;
  }, BANNER_HIDE_MS);
}

  function normalizeIpv4Display(value) {
    const raw = String(value || '').trim();
    if (!raw) return '--';
    return raw.includes('/') ? raw.split('/')[0].trim() || '--' : raw;
  }


  function setText(el, value, fallback = '--') {
    if (!el) return;
    const raw = String(value ?? '').trim();
    el.textContent = raw || fallback;
  }

  function setLteMeta(state = {}) {
    setText(lteSimStatusLabel, state.sim_status, 'No data');
    setText(lteOperatorLabel, state.operator, '--');
    setText(lteSignalLabel, state.signal, '--');
    setText(lteRegistrationLabel, state.registration_state || state.access_technology || state.flags, '--');
    setText(lteImeiLabel, state.imei, '--');
    setText(lteIccidLabel, state.iccid, '--');
    setText(lteIpLabel, normalizeIpv4Display(state.ip_address || state.current_ip || ''), 'No IPv4 assigned');
    setText(lteGatewayLabel, normalizeIpv4Display(state.gateway || state.current_gateway || ''), '--');
    setText(lteInterfaceLabel, state.interface || state.device, '--');
    setText(lteFlagsLabel, state.flags, '--');
    setText(lteIpv6Label, state.ipv6, '--');
    setText(lteAddressLabel, state.address, '--');
    const pktText = [state.rx_packets, state.tx_packets].filter(v => String(v ?? '').trim() !== '').join(' / ');
    setText(ltePacketsLabel, pktText ? `RX ${state.rx_packets} / TX ${state.tx_packets}` : '', '--');
    const byteText = [state.rx_bytes, state.tx_bytes].filter(v => String(v ?? '').trim() !== '').join(' / ');
    setText(lteBytesLabel, byteText ? `RX ${state.rx_bytes} / TX ${state.tx_bytes}` : '', '--');
    const mtuQueue = [state.mtu ? `MTU ${state.mtu}` : '', state.txqueuelen ? `Queue ${state.txqueuelen}` : ''].filter(Boolean).join(' / ');
    setText(lteMtuQueueLabel, mtuQueue, '--');
    if (lteStatusNote) {
      const note = String(state.note || '').trim();
      lteStatusNote.textContent = note || 'LTE details are sourced from rmnet_mhi0 / rmnet_mhi0.1 during refresh.';
    }
  }

  function setHeaderMeta({ device = '', activeSsid = '', ipAddress = '', gateway = '', netmask = '' } = {}) {
    currentActiveSsid = String(activeSsid || '').trim();

    if (deviceLabel) {
      deviceLabel.textContent = device ? `Interface: ${device}` : 'Interface: —';
    }

    if (wifiStatusBadge) {
      wifiStatusBadge.textContent = currentActiveSsid ? 'Connected' : 'Disconnected';
      wifiStatusBadge.classList.toggle('wifi-status-connected', !!currentActiveSsid);
      wifiStatusBadge.classList.toggle('wifi-status-disconnected', !currentActiveSsid);
    }

    if (currentNetworkLabel) {
      currentNetworkLabel.textContent = currentActiveSsid || '—';
    }

    if (wifiEditBtn) {
      const hasActive = !!currentActiveSsid;
      wifiEditBtn.disabled = !hasActive;
      wifiEditBtn.setAttribute('aria-disabled', String(!hasActive));
      wifiEditBtn.title = hasActive
        ? `Edit Advanced Wi‑Fi Settings for ${currentActiveSsid}`
        : 'No connected Wi‑Fi network';
    }

    if (ipLabel) {
      ipLabel.textContent = normalizeIpv4Display(ipAddress);
    }
    if (gatewayLabel) {
      gatewayLabel.textContent = normalizeIpv4Display(gateway);
    }
    if (netmaskLabel) {
      netmaskLabel.textContent = String(netmask || '').trim() || '--';
    }
  }

  function clearWifiControlBox({ keepDevice = true } = {}) {
    const deviceText = keepDevice ? currentDevice : '';
    setHeaderMeta({
      device: deviceText,
      activeSsid: '',
      ipAddress: '',
      gateway: '',
      netmask: ''
    });
  }

  function clearNetworkListForToggle(title, subtitle, tone = 'neutral', summary = '') {
    networks = [];
    rowMap.clear();
    setNetworkSummary(0, summary);
    renderState(title, subtitle, tone);
  }

  function setNetworkSummary(total = 0, extra = '') {
    if (!networkSummaryLabel) return;
    const count = Number(total) || 0;
    const base = count > 0 ? `Found ${count} networks` : 'No networks found';
    const suffix = extra ? ` · ${extra}` : '';
    networkSummaryLabel.textContent = `${base}${suffix}`;
  }

  function formatBand(n) {
    return n.band || (Number(n.frequency) >= 4900 ? '5 GHz' : (Number(n.frequency) >= 2400 ? '2.4 GHz' : ''));
  }

  function networkDetailsLine(n) {
    const parts = [];
    if (n.bssid) parts.push(`BSSID ${n.bssid}`);
    if (n.channel) parts.push(`CH ${n.channel}`);
    if (n.frequency) parts.push(`${n.frequency} MHz`);
    return parts.join(' · ');
  }

  function renderState(title, subtitle, tone = 'neutral') {
    if (!netList) return;
    netList.innerHTML = `
      <div class="wifi-state wifi-state-${tone}">
        <div class="wifi-state-title">${escHtml(title)}</div>
        <div class="wifi-state-subtitle">${escHtml(subtitle || '')}</div>
      </div>
    `;
  }

  function signalToBars(signal) {
    const s = Math.max(0, Math.min(100, Number(signal) || 0));
    if (s <= 0) return 0;
    if (s <= 30) return 1;
    if (s <= 70) return 2;
    return 3;
  }

  function wifiBarsIcon(signal) {
    const bars = signalToBars(signal);
    const b1 = bars >= 1 ? 'on' : '';
    const b2 = bars >= 2 ? 'on' : '';
    const b3 = bars >= 3 ? 'on' : '';
    const pct = Math.max(0, Math.min(100, Number(signal) || 0));

    return `
      <span class="wifi-bars" data-bars="${bars}" aria-hidden="true" title="Signal ${pct}%">
        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
          <path class="w3 ${b3}" d="M2 6.5c5.9-5 14.1-5 20 0" stroke-width="2" stroke-linecap="round"/>
          <path class="w2 ${b2}" d="M5 10c4.1-3.4 9.9-3.4 14 0" stroke-width="2" stroke-linecap="round"/>
          <path class="w1 ${b1}" d="M8.5 13.2c2.2-1.8 4.8-1.8 7 0" stroke-width="2" stroke-linecap="round"/>
          <circle class="wd ${bars > 0 ? 'on' : ''}" cx="12" cy="16" r="1.5"/>
        </svg>
      </span>
    `;
  }

  function lockIcon() {
    return `
      <span class="lock" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 11h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" stroke-width="2"/>
        </svg>
      </span>
    `;
  }

  function knownIcon() {
    return `<span class="known-mark" aria-hidden="true" title="Saved network">★</span>`;
  }

  function alertBtn() {
    return `<div class="alert-btn" role="button" tabindex="0" title="Advanced">i</div>`;
  }

  async function apiWifiState() {
    const res = await fetch(apiUrl('wifi_state'), { cache: 'no-store' });
    const json = await parseJsonResponse(res);
    return json.data || {};
  }

  async function apiScan() {
    const res = await fetch(apiUrl('scan'), { cache: 'no-store' });
    const json = await parseJsonResponse(res);
    return json.data || {};
  }

  async function apiLteState() {
    const res = await fetch(apiUrl('lte_state'), { cache: 'no-store' });
    const json = await parseJsonResponse(res);
    return json.data || {};
  }

  async function apiJoin(ssid, password, bssid = '') {
    const res = await fetch(apiUrl('join'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ssid, password, bssid })
    });
    return parseJsonResponse(res);
  }

  async function apiForgetConnection(ssid) {
    const res = await fetch(apiUrl('forget'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ssid })
    });
    return parseJsonResponse(res);
  }

  async function apiAdvInfo(ssid) {
    const res = await fetch(apiUrl('advinfo', { ssid }), { cache: 'no-store' });
    const json = await parseJsonResponse(res);
    return json.data || {};
  }

  async function apiApplyIpv4(payload) {
    const res = await fetch(apiUrl('apply_ipv4'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return parseJsonResponse(res);
  }

  async function apiToggleWifi(on) {
    const res = await fetch(apiUrl('wifi_toggle'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ on })
    });
    const json = await parseJsonResponse(res);
    return json.data || {};
  }

  function openJoinModal(ssid, bssid = '') {
    if (!overlay) return;
    overlay.dataset.ssid = ssid;
    overlay.dataset.bssid = bssid || '';
    modalTitle.textContent = `Join ${ssid}`;
    modalSub.textContent = `Enter the password for “${ssid}”`;
    modalError.textContent = '';
    pwd.value = '';
    showPwd.checked = false;
    pwd.type = 'password';
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => pwd.focus(), 50);
  }

  function closeJoinModal() {
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.dataset.ssid = '';
    overlay.dataset.bssid = '';
    modalError.textContent = '';
  }

  function getIpv4Method() {
    const el = document.querySelector('input[name="ipv4method"]:checked');
    return el ? el.value : 'auto';
  }

  function setIpv4Method(method) {
    const value = String(method || 'auto');
    const safe = (window.CSS && typeof CSS.escape === 'function') ? CSS.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, '');
    const el = document.querySelector(`input[name="ipv4method"][value="${safe}"]`);
    if (el) el.checked = true;
  }

  function setAddressesEnabled(enabled) {
    [addrIp, addrMask, addrGw, addrDel].forEach((el) => {
      if (el) el.disabled = !enabled;
    });
  }

  async function openAdvancedModal(network) {
    if (!advOverlay) return;
    const obj = (network && typeof network === 'object') ? network : { ssid: String(network || ''), device: currentDevice || '' };
    const ssid = obj.ssid || '';
    advOverlay.dataset.device = obj.device || currentDevice || '';
    advOverlay.dataset.ssid = ssid;
    advTitle.textContent = 'Advanced Wi‑Fi Settings';
    advSub.textContent = ssid ? `“${ssid}”` : 'Saved or active profile';
    setIpv4Method('auto');
    setToggle(dnsAutoToggle, true);
    dnsInput.value = '';
    dnsInput.disabled = true;
    addrIp.value = '';
    addrMask.value = '';
    addrGw.value = '';
    setAddressesEnabled(false);
    currentIpLabel.textContent = 'Now: —';

    advOverlay.classList.add('show');
    advOverlay.setAttribute('aria-hidden', 'false');

    try {
      const info = await apiAdvInfo(ssid);
      advOverlay.dataset.device = info.device || advOverlay.dataset.device || currentDevice || '';
      advOverlay.dataset.ssid = info.ssid || ssid;
      advSub.textContent = info.active ? `“${info.ssid || ssid}” (connected)` : `“${info.ssid || ssid}” (saved profile)`;
      currentIpLabel.textContent = info.active
        ? `Now: ${info.dev_ip4_address || '—'} via ${info.dev_ip4_gateway || '—'}`
        : 'Now: profile is saved but not currently connected';

      const methodFromBackend = info.ipv4_method || 'auto';
      setIpv4Method(methodFromBackend);
      setAddressesEnabled(methodFromBackend === 'manual');

      let addrSrc = '';
      let gwSrc = '';
      if (methodFromBackend === 'manual') {
        addrSrc = String(info.ipv4_addresses || '');
        gwSrc = String(info.ipv4_gateway || '');
      } else {
        addrSrc = String(info.dev_ip4_address || info.ipv4_addresses || '');
        gwSrc = String(info.dev_ip4_gateway || info.ipv4_gateway || '');
      }

      if (addrSrc.includes('/')) {
        const [ip, prefixStr] = addrSrc.split('/');
        if (ip.trim()) addrIp.value = ip.trim();
        const prefix = parseInt(prefixStr, 10);
        if (!Number.isNaN(prefix)) addrMask.value = prefixToMask(prefix);
      } else if (addrSrc.trim()) {
        addrIp.value = addrSrc.trim();
      }
      if (gwSrc.trim()) addrGw.value = gwSrc.trim();

      const dnsAuto = info.dns_auto !== false;
      setToggle(dnsAutoToggle, dnsAuto);
      dnsInput.disabled = dnsAuto;
      dnsInput.value = String(info.dns || '');
    } catch (err) {
      advSub.textContent = `${advSub.textContent} — ${err.message || 'Unable to load IP details.'}`;
    }
  }

  function closeAdvancedModal() {
    if (!advOverlay) return;
    advOverlay.classList.remove('show');
    advOverlay.setAttribute('aria-hidden', 'true');
    advOverlay.dataset.device = '';
    advOverlay.dataset.ssid = '';
  }

  function markKnownNetwork(ssid) {
    const target = networks.find((x) => x.ssid === ssid);
    if (target) target.known = true;
  }

  function buildRow(n) {
    const wrap = document.createElement('button');
    wrap.type = 'button';
    wrap.className = `taprow${n.active ? ' active' : ''}`;
    wrap.dataset.ssid = n.ssid;
    wrap.dataset.key = networkKey(n);
    wrap.dataset.bssid = n.bssid || '';
    wrap.dataset.frequency = n.frequency || '';
    wrap.dataset.channel = n.channel || '';

    const secureBadge = n.secure ? '<span class="wifi-pill wifi-pill-neutral">Secure</span>' : '<span class="wifi-pill wifi-pill-open">Open</span>';
    const band = formatBand(n);
    const details = networkDetailsLine(n);

    wrap.innerHTML = `
      <div class="wifi-net-row">
        <div class="wifi-row-left">
          <div class="wifi-row-title-wrap">
            <div class="wifi-row-title">${escHtml(n.ssid)}</div>
            <div class="wifi-row-details">${escHtml(details)}</div>
          </div>
          <div class="wifi-row-meta">
            ${n.active ? '<span class="wifi-pill wifi-pill-primary">Connected</span>' : ''}
            ${n.known ? '<span class="wifi-pill wifi-pill-info">Saved</span>' : ''}
            ${band ? `<span class="wifi-pill wifi-pill-band">${escHtml(band)}</span>` : ''}
            ${n.channel ? `<span class="wifi-pill wifi-pill-neutral">CH ${escHtml(n.channel)}</span>` : ''}
            ${secureBadge}
          </div>
        </div>
        <div class="icons">
          ${n.known ? knownIcon() : ''}
          ${n.secure ? lockIcon() : ''}
          ${wifiBarsIcon(Number(n.signal ?? 0))}
          ${alertBtn()}
        </div>
      </div>
    `;

    wrap.addEventListener('click', async (e) => {
      const isInfo = e.target.closest('.alert-btn');
      const current = networks.find((x) => networkKey(x) === wrap.dataset.key) || n;
      const isSecure = !!current.secure;

      if (isInfo) {
        if (current.active || current.known) {
          openAdvancedModal(current.ssid);
        }
        return;
      }

      if (current.active) {
        openAdvancedModal(current.ssid);
        return;
      }

      if (current.known) {
        try {
          stopAutoRefresh();
          wrap.disabled = true;
          setConnectingRow(networkKey(current), true);
          showBanner(`Connecting to saved network “${current.ssid}”…`, 'info');
          await apiJoin(current.ssid, '', current.bssid || '');
          markKnownNetwork(current.ssid);
          await syncWifiState();
          await loadNetworks({ silent: false });
          showBanner(`Connected to “${current.ssid}”.`, 'success');
        } catch (err) {
          showBanner(err?.message || 'Join saved network failed.', 'danger');
        } finally {
          wrap.disabled = false;
          setConnectingRow(networkKey(current), false);
          startAutoRefresh();
        }
        return;
      }

      if (isSecure) {
        openJoinModal(current.ssid, current.bssid || '');
        return;
      }

      try {
        stopAutoRefresh();
        wrap.disabled = true;
        setConnectingRow(networkKey(current), true);
        showBanner(`Connecting to open network “${current.ssid}”…`, 'info');
        await apiJoin(current.ssid, '', current.bssid || '');
        markKnownNetwork(current.ssid);
        await syncWifiState();
        await loadNetworks({ silent: false });
        showBanner(`Connected to “${current.ssid}”.`, 'success');
      } catch (err) {
        showBanner(err?.message || 'Join failed.', 'danger');
      } finally {
        wrap.disabled = false;
        setConnectingRow(networkKey(current), false);
        startAutoRefresh();
      }
    });

    return wrap;
  }

  function updateRowEl(el, n) {
    if (!el) return;
    el.classList.toggle('active', !!n.active);
    el.dataset.ssid = n.ssid;
    el.dataset.key = networkKey(n);
    el.dataset.bssid = n.bssid || '';
    el.dataset.frequency = n.frequency || '';
    el.dataset.channel = n.channel || '';
    const icons = el.querySelector('.icons');
    const meta = el.querySelector('.wifi-row-meta');
    const title = el.querySelector('.wifi-row-title');
    const details = el.querySelector('.wifi-row-details');
    if (title) title.textContent = n.ssid;
    if (details) details.textContent = networkDetailsLine(n);
    if (meta) {
      const band = formatBand(n);
      meta.innerHTML = `
        ${n.active ? '<span class="wifi-pill wifi-pill-primary">Connected</span>' : ''}
        ${n.known ? '<span class="wifi-pill wifi-pill-info">Saved</span>' : ''}
        ${band ? `<span class="wifi-pill wifi-pill-band">${escHtml(band)}</span>` : ''}
        ${n.channel ? `<span class="wifi-pill wifi-pill-neutral">CH ${escHtml(n.channel)}</span>` : ''}
        ${n.secure ? '<span class="wifi-pill wifi-pill-neutral">Secure</span>' : '<span class="wifi-pill wifi-pill-open">Open</span>'}
      `;
    }
    if (icons && !el.classList.contains('connecting')) {
      icons.innerHTML = `
        ${n.known ? knownIcon() : ''}
        ${n.secure ? lockIcon() : ''}
        ${wifiBarsIcon(Number(n.signal ?? 0))}
        ${alertBtn()}
      `;
    }
  }

  function fullRender(list) {
    setNetworkSummary(list.length);
    rowMap.clear();
    netList.innerHTML = '';
    list.forEach((n) => {
      const row = buildRow(n);
      rowMap.set(networkKey(n), row);
      netList.appendChild(row);
    });
  }

  function diffUpdate(list) {
    const nextKeys = new Set(list.map((x) => networkKey(x)));
    setNetworkSummary(list.length);
    for (const [key, el] of rowMap.entries()) {
      if (!nextKeys.has(key)) {
        el.remove();
        rowMap.delete(key);
      }
    }
    netList.innerHTML = '';
    list.forEach((n) => {
      const key = networkKey(n);
      let el = rowMap.get(key);
      if (!el) {
        el = buildRow(n);
        rowMap.set(key, el);
      } else {
        updateRowEl(el, n);
      }
      netList.appendChild(el);
    });
  }

  function setConnectingRow(key, connecting) {
    const row = rowMap.get(key);
    if (!row) return;
    const icons = row.querySelector('.icons');
    if (!icons) return;

    if (connecting) {
      row.classList.add('connecting');
      if (!icons.dataset.prevIcons) icons.dataset.prevIcons = icons.innerHTML;
      icons.innerHTML = '<div class="spinner" aria-label="Connecting"></div>';
    } else {
      row.classList.remove('connecting');
      if (icons.dataset.prevIcons) {
        icons.innerHTML = icons.dataset.prevIcons;
        delete icons.dataset.prevIcons;
      }
      const data = networks.find((n) => networkKey(n) === key);
      if (data) updateRowEl(row, data);
    }
  }

  async function syncLteState({ silent = true } = {}) {
    try {
      const state = await apiLteState();
      setLteMeta(state || {});
      return state;
    } catch (err) {
      setLteMeta({
        sim_status: 'No data',
        operator: '',
        signal: '',
        registration_state: '',
        imei: '',
        iccid: '',
        ip_address: '',
        gateway: '',
        note: err?.message || 'Unable to read LTE backend data.'
      });
      if (!silent) {
        showBanner(err?.message || 'Unable to read LTE backend data.', 'warning');
      }
      return null;
    }
  }

  async function syncWifiState({ silent = true } = {}) {
    try {
      const state = await apiWifiState();
      wifiEnabled = !!state.enabled;
      currentDevice = state.device || currentDevice || '';
      setToggle(wifiToggle, wifiEnabled);
      setHeaderMeta({
        device: currentDevice,
        activeSsid: state.active_ssid || '',
        ipAddress: state.current_ip || '',
        gateway: state.current_gateway || '',
        netmask: state.current_netmask || ''
      });

      if (!wifiEnabled) {
        stopAutoRefresh();
        setHeaderMeta({ device: currentDevice, activeSsid: '', ipAddress: '', gateway: '', netmask: '' });
        setNetworkSummary(0, 'Wi‑Fi off');
        renderState('Wi‑Fi is Off', 'Turn Wi‑Fi back on to scan and connect to available networks.', 'warning');
        if (!silent) showBanner('Wi‑Fi radio is currently off.', 'warning');
      }
      return state;
    } catch (err) {
      wifiEnabled = false;
      stopAutoRefresh();
      setToggle(wifiToggle, false);
      setHeaderMeta({ device: currentDevice, activeSsid: '', ipAddress: '', gateway: '', netmask: '' });
      setNetworkSummary(0, 'Backend error');
      renderState('Backend is not ready', err.message || 'Unable to read Wi‑Fi state.', 'error');
      showBanner(err.message || 'Unable to read Wi‑Fi state.', 'danger');
      throw err;
    }
  }

  async function loadNetworks({ silent = false } = {}) {
    if (!netList || inFlight) return;
    if (!wifiEnabled) {
      setNetworkSummary(0, 'Wi‑Fi off');
      renderState('Wi‑Fi is Off', 'Turn Wi‑Fi back on to scan and connect to available networks.', 'warning');
      return;
    }

    inFlight = true;
    if (!silent) {
      setNetworkSummary(0, 'Scanning');
      renderState('Scanning networks…', 'Please wait while available access points are detected.', 'neutral');
    }

    try {
      const payload = await apiScan();
      if (payload?.warning && !silent) {
        showBanner(payload.warning, 'warning');
      }
      wifiEnabled = payload.enabled !== false;
      currentDevice = payload.device || currentDevice || '';
      setHeaderMeta({
        device: currentDevice,
        activeSsid: payload.active_ssid || (networks.find((x) => x.active) || {}).ssid || '',
        ipAddress: payload.current_ip || '',
        gateway: payload.current_gateway || '',
        netmask: payload.current_netmask || ''
      });

      if (!wifiEnabled) {
        setToggle(wifiToggle, false);
        setHeaderMeta({ device: currentDevice, activeSsid: '', ipAddress: '', gateway: '', netmask: '' });
        renderState('Wi‑Fi is Off', 'Turn Wi‑Fi back on to scan and connect to available networks.', 'warning');
        return;
      }

      const list = Array.isArray(payload.rows) ? payload.rows : [];
      networks = list;
      const active = networks.find((x) => x.active);
      setHeaderMeta({
        device: currentDevice,
        activeSsid: payload.active_ssid || active?.ssid || '',
        ipAddress: payload.current_ip || '',
        gateway: payload.current_gateway || '',
        netmask: payload.current_netmask || ''
      });

      setNetworkSummary(payload.count ?? list.length);

      if (list.length === 0) {
        renderState('No Wi‑Fi networks found', 'Try Refresh again or move closer to an access point.', 'neutral');
        rowMap.clear();
        return;
      }

      if (rowMap.size === 0) {
        fullRender(networks);
        setNetworkSummary(payload.count ?? networks.length);
      } else {
        diffUpdate(networks);
      }
    } catch (err) {
      setNetworkSummary(0, 'Scan failed');
      renderState('Scan failed', err.message || 'The device could not read nearby networks right now.', 'error');
      showBanner(err.message || 'Scan failed.', 'danger');
    } finally {
      await syncLteState({ silent: true });
      inFlight = false;
    }
  }

  document.getElementById('closeModal')?.addEventListener('click', closeJoinModal);
  document.getElementById('cancelBtn')?.addEventListener('click', closeJoinModal);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeJoinModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (overlay?.classList.contains('show')) closeJoinModal();
      if (advOverlay?.classList.contains('show')) closeAdvancedModal();
    }
  });

  showPwd?.addEventListener('change', () => {
    pwd.type = showPwd.checked ? 'text' : 'password';
    pwd.focus();
  });

  wifiEditBtn?.addEventListener('click', () => {
    if (!currentActiveSsid) return;
    openAdvancedModal({ ssid: currentActiveSsid, device: currentDevice || '' });
  });

  joinBtn?.addEventListener('click', async () => {
    const ssid = overlay?.dataset.ssid || '';
    const bssid = overlay?.dataset.bssid || '';
    const pass = (pwd.value || '').trim();
    const target = networks.find((n) => n.ssid === ssid && (bssid ? (n.bssid || '') === bssid : true));
    const rowKey = target ? networkKey(target) : ssid;
    if (modalError) modalError.textContent = '';

    if (!pass) {
      if (modalError) modalError.textContent = 'Please enter password.';
      pwd.focus();
      return;
    }

    try {
      stopAutoRefresh();
      if (joinBtn) joinBtn.disabled = true;
      setConnectingRow(rowKey, true);
      closeJoinModal();
      showBanner(`Connecting to “${ssid}”…`, 'info');
      await apiJoin(ssid, pass, bssid);
      markKnownNetwork(ssid);
      await syncWifiState();
      await loadNetworks({ silent: false });
      await syncLteState({ silent: true });
      showBanner(`Connected to “${ssid}”.`, 'success');
    } catch (err) {
      showBanner(err?.message || 'Join failed.', 'danger');
    } finally {
      if (joinBtn) joinBtn.disabled = false;
      setConnectingRow(rowKey, false);
      startAutoRefresh();
    }
  });

  advClose?.addEventListener('click', closeAdvancedModal);
  advCancel?.addEventListener('click', closeAdvancedModal);
  advOverlay?.addEventListener('click', (e) => { if (e.target === advOverlay) closeAdvancedModal(); });

  document.querySelectorAll('input[name="ipv4method"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      setAddressesEnabled(getIpv4Method() === 'manual');
    });
  });

  dnsAutoToggle?.addEventListener('click', () => {
    const next = !dnsAutoToggle.classList.contains('on');
    setToggle(dnsAutoToggle, next);
    dnsInput.disabled = next;
    if (!next) dnsInput.focus();
  });

  addrDel?.addEventListener('click', () => {
    addrIp.value = '';
    addrMask.value = '';
    addrGw.value = '';
  });

  advDisconnect?.addEventListener('click', async () => {
    const ssid = advOverlay?.dataset.ssid || '';
    try {
      if (!ssid) throw new Error('SSID not found.');
      advDisconnect.disabled = true;
      stopAutoRefresh();
      closeAdvancedModal();
      showBanner(`Removing saved profile for “${ssid}”…`, 'info');
      await apiForgetConnection(ssid);
      await syncWifiState({ silent: true });
      await loadNetworks({ silent: false });
      await syncLteState({ silent: true });
      showBanner(`Removed saved profile for “${ssid}”.`, 'success');
    } catch (err) {
      showBanner(err?.message || 'Forget failed.', 'danger');
    } finally {
      advDisconnect.disabled = false;
      startAutoRefresh();
    }
  });

  advSave?.addEventListener('click', async () => {
    try {
      advSave.disabled = true;
      stopAutoRefresh();
      const ssid = advOverlay?.dataset.ssid || '';
      const method = getIpv4Method();
      const dns_auto = dnsAutoToggle.classList.contains('on');
      const dns = (dnsInput.value || '').trim();
      const ip = (addrIp.value || '').trim();
      const mask = (addrMask.value || '').trim();
      const gw = (addrGw.value || '').trim();

      if (method === 'manual') {
        if (!ip || !mask) {
          throw new Error('Manual mode requires IP Address and Subnet Mask.');
        }
        if (ip.includes('/')) {
          throw new Error('Enter IP only, without CIDR suffix. Example: 192.168.10.50');
        }
      }

      const result = await apiApplyIpv4({ ssid, method, ip, mask, gw, dns_auto, dns });
      closeAdvancedModal();
      await syncWifiState({ silent: true });
      await loadNetworks({ silent: false });
      const warning = result?.data?.warning || '';
      showBanner(warning ? `Settings saved. Reapply warning: ${warning}` : 'Wi‑Fi IPv4 settings saved.', warning ? 'warning' : 'success');
    } catch (err) {
      showBanner(err?.message || 'Save failed.', 'danger');
      alert(err?.message || 'Save failed');
    } finally {
      advSave.disabled = false;
      startAutoRefresh();
    }
  });

  bindToggle(wifiToggle, async (on) => {
    try {
      stopAutoRefresh();

      // Clear stale values immediately whenever Wi‑Fi is toggled.
      clearWifiControlBox({ keepDevice: true });

      if (on) {
        clearNetworkListForToggle(
          'Turning Wi‑Fi On…',
          'Please wait while Wi‑Fi is being enabled and nearby networks are scanned.',
          'neutral',
          'Turning on'
        );
      } else {
        clearNetworkListForToggle(
          'Wi‑Fi is Off',
          'Turn Wi‑Fi back on to scan and connect to available networks.',
          'warning',
          'Wi‑Fi off'
        );
      }

      const result = await apiToggleWifi(on);
      wifiEnabled = !!result.enabled;
      setToggle(wifiToggle, wifiEnabled);

      if (wifiEnabled) {
        showBanner('Wi‑Fi radio turned on.', 'success');

        // Clear once more to avoid old values lingering while the fresh state is loading.
        clearWifiControlBox({ keepDevice: true });

        await syncWifiState({ silent: true });
        await loadNetworks({ silent: false });
        await syncLteState({ silent: true });
        startAutoRefresh();
      } else {
        clearWifiControlBox({ keepDevice: true });
        showBanner('Wi‑Fi radio turned off.', 'warning');
        clearNetworkListForToggle(
          'Wi‑Fi is Off',
          'Turn Wi‑Fi back on to scan and connect to available networks.',
          'warning',
          'Wi‑Fi off'
        );
        await syncLteState({ silent: true });
        stopAutoRefresh();
      }
    } catch (err) {
      setToggle(wifiToggle, !on);
      showBanner(err?.message || 'Toggle failed.', 'danger');

      // Sync back from the real device state if toggle fails.
      try {
        await syncWifiState({ silent: true });
        if (wifiEnabled) {
          await loadNetworks({ silent: true });
          startAutoRefresh();
        }
      } catch (_) {}
    }
  });

  if (askToggle) {
    bindToggle(askToggle, (on) => {
      localStorage.setItem(ASK_JOIN_STORAGE_KEY, on ? '1' : '0');
      showBanner(on ? 'Ask to Join Networks is on for this browser.' : 'Ask to Join Networks is off for this browser.', 'info');
    });
  }

  refreshBtn?.addEventListener('click', async () => {
    stopAutoRefresh();
    clearWifiControlBox({ keepDevice: true });
    clearNetworkListForToggle(
      'Refreshing networks…',
      'Please wait while nearby access points are rescanned.',
      'neutral',
      'Refreshing'
    );
    await syncWifiState({ silent: true });
    await loadNetworks({ silent: false });
    await syncLteState({ silent: true });
    if (wifiEnabled) startAutoRefresh();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoRefresh();
    } else if (wifiEnabled) {
      syncWifiState({ silent: true })
        .then(() => loadNetworks({ silent: true }))
        .then(() => syncLteState({ silent: true }))
        .finally(startAutoRefresh);
    } else {
      syncLteState({ silent: true });
    }
  });

  async function init() {
    const askStored = localStorage.getItem(ASK_JOIN_STORAGE_KEY);
    if (askToggle) setToggle(askToggle, askStored === '1');

    try {
      await syncLteState({ silent: true });
      await syncWifiState({ silent: true });
      if (wifiEnabled) {
        await loadNetworks({ silent: false });
        startAutoRefresh();
      }
    } catch (err) {
      stopAutoRefresh();
      await syncLteState({ silent: true });
    }
  }

  init();
})();
