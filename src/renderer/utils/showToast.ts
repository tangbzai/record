export default function showToast(options?: {
  title?: string;
  duration?: number;
}) {
  const body = document.getElementsByTagName('body')[0];
  const duration = options?.duration || 1500;
  const toast = document.createElement('div');
  toast.setAttribute('class', '__Toast__');
  toast.innerText = options?.title || '';
  toast.setAttribute(
    'style',
    `animation-duration: ${(duration * 12) / 10000}s`,
  );
  body.appendChild(toast);
  setTimeout(
    () => {
      body.removeChild(toast);
    },
    (duration * 12) / 10,
  );
}
