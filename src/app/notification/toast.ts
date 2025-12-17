type ToastType = 'info' | 'success' | 'error';

export const showNotificationToast = (
    title: string,
    body: string,
    type: ToastType = 'info'
) => {
    const toast = document.createElement('div');

    const colors = {
        info: { bg: '#e7f1ff', border: '#b6d4fe', text: '#084298' },
        success: { bg: '#d1e7dd', border: '#badbcc', text: '#0f5132' },
        error: { bg: '#f8d7da', border: '#f5c2c7', text: '#842029' },
    };

    const { bg, border, text } = colors[type];

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
      border: 1px solid ${border};
      border-radius: 10px;
      padding: 14px 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      font-family: system-ui;
      animation: slideIn 0.3s ease;
    ">
      <strong style="display:block; margin-bottom:4px;">${title}</strong>
      <div style="font-size:14px;">${body}</div>
      <span style="
        position:absolute;
        top:8px;
        right:12px;
        cursor:pointer;
        font-size:16px;
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
