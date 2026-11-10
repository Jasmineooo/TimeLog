(function weeklyBackup() {
  const KEY = '__lastBackupAt';
  const WEEK = 7 * 24 * 3600 * 1000;
  const now = Date.now();
  const last = +localStorage.getItem(KEY) || 0;
  if (now - last < WEEK) return; // 本周已备份过

  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k !== KEY) data[k] = localStorage.getItem(k);
  }

  const app = location.pathname.replace(/\W+/g, '_') || 'index';
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = `backup-${app}-${date}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);

  localStorage.setItem(KEY, String(now)); // 成功后才记录时间，失败下周重试
})();