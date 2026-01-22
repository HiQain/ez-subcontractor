type ToastType = 'success' | 'error';

export const showToast = (
    message: string,
    type: ToastType = 'success',
    duration = 4000
) => {
    // Remove existing toast
    const existing = document.getElementById('global-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'global-toast';

    const isMobile = window.innerWidth <= 768;

    const styles = {
        success: {
            bg: '#d4edda',
            text: '#155724',
            border: '#c3e6cb',
            icon: '✅',
        },
        error: {
            bg: '#f8d7da',
            text: '#721c24',
            border: '#f5c6cb',
            icon: '❌',
        },
    };

    const { bg, text, border, icon } = styles[type];

    toast.setAttribute(
        'style',
        `
    position: fixed;
    top: ${isMobile ? '10px' : '20px'};
    left: ${isMobile ? '10px' : 'auto'};
    right: ${isMobile ? '10px' : '20px'};
    z-index: 9999;
    background-color: ${bg};
    color: ${text};
    border: 1px solid ${border};
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    max-width: ${isMobile ? 'calc(100vw - 20px)' : '420px'};
    width: auto;
  `
    );

    toast.innerHTML = `
    <span style="flex:1">${icon} ${message}</span>
    <button 
      style="
        background: transparent;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: ${text};
      "
    >
      ✕
    </button>
  `;

    document.body.appendChild(toast);

    const removeToast = () => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.2s ease';
        setTimeout(() => toast.remove(), 200);
    };

    const timeoutId = setTimeout(removeToast, duration);

    toast.querySelector('button')?.addEventListener('click', () => {
        clearTimeout(timeoutId);
        removeToast();
    });
};
