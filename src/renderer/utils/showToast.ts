function getBaseToastBox() {
  let toastBox = document.getElementById('_base_toast_box_');
  if (!toastBox) {
    toastBox = document.createElement('div');
    toastBox.setAttribute('id', '_base_toast_box_');
    document.body.appendChild(toastBox);
  }
  return toastBox;
}

export default function showToast(options?: {
  title?: string;
  duration?: number;
}) {
  const toastBox = getBaseToastBox();
  const duration = options?.duration || 1500;
  const toast = document.createElement('div');
  toast.setAttribute('class', '__Toast__');
  toast.innerText = options?.title || '';
  toast.setAttribute(
    'style',
    `animation-duration: ${(duration * 12) / 10000}s`,
  );
  toastBox.appendChild(toast);
  setTimeout(
    () => {
      toastBox.removeChild(toast);
    },
    (duration * 12) / 10,
  );
}
