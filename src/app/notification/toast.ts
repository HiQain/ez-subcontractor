type ToastType = 'info' | 'success' | 'error';

export const showNotificationToast = (
  title: string,
  body: string,
  type: ToastType = 'info'
) => {
  const toast = document.createElement('div');

  const styles = {
    info: {
      bg: '#ffffff',
      border: '#3b82f6',
      text: '#1e3a8a',
      icon: 'ℹ️',
    },
    success: {
      bg: '#ffffff',
      border: '#22c55e',
      text: '#14532d',
      icon: '✅',
    },
    error: {
      bg: '#ffffff',
      border: '#ef4444',
      text: '#7f1d1d',
      icon: '❌',
    },
  };

  const { bg, border, text, icon } = styles[type];

  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      min-width: 320px;
      max-width: 380px;
      background: ${bg};
      color: ${text};
      border-left: 6px solid ${border};
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      font-family: system-ui, -apple-system, BlinkMacSystemFont;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      animation: toastSlideIn 0.35s ease;
    ">
      <div style="font-size:22px; line-height:1">${icon}</div>

      <div style="flex:1">
        <strong style="display:block; font-size:15px; margin-bottom:2px;">
          ${title}
        </strong>
        <div style="font-size:14px; opacity:0.9;">
          ${body}
        </div>
      </div>

      <span style="
        cursor:pointer;
        font-size:16px;
        opacity:0.6;
        line-height:1;
      ">✖</span>
    </div>
  `;

  document.body.appendChild(toast);

  const closeBtn = toast.querySelector('span');
  closeBtn?.addEventListener('click', () => toast.remove());

  setTimeout(() => {
    toast.remove();
  }, 5000);
};