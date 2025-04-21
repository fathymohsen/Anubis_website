async function resizeImage(file, maxWidth = 800) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(blob), file.type);
    };
    img.src = URL.createObjectURL(file);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const fileName = document.getElementById('fileName');
  const preview = document.getElementById('preview');
  const spinner = document.getElementById('spinner');
  const submitBtn = document.querySelector('button[type="submit"]');
  const resultDiv = document.getElementById('result');
  const dropArea = document.getElementById('dropzoneArea');

  // Drag & Drop events
  ['dragenter', 'dragover'].forEach(evt => {
    dropArea.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); dropArea.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(evt => {
    dropArea.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); dropArea.classList.remove('dragover'); });
  });
  dropArea.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event('change'));
    }
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    fileName.textContent = file ? file.name : 'لم يتم اختيار أي ملف';
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  });

  async function uploadWithRetry(formData, retries = 2) {
    try {
      const res = await fetch('https://503e-102-42-107-91.ngrok-free.app/recognize', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      if (retries > 0) return await uploadWithRetry(formData, retries - 1);
      throw err;
    }
  }

  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري الرفع...';
    spinner.style.display = 'block';
    resultDiv.textContent = '';

    try {
      const originalFile = fileInput.files[0];
      const blob = await resizeImage(originalFile);
      const fd = new FormData(); fd.append('image', blob, originalFile.name);

      const data = await uploadWithRetry(fd);
      const msg = data.message || 'لا توجد رسالة';
      let html = `<p>${msg}</p>`;
      if (data.confidence) html += `<small>مستوى الثقة: ${(data.confidence * 100).toFixed(1)}%</small>`;
      resultDiv.innerHTML = html;
    } catch (error) {
      console.error(error);
      resultDiv.textContent = 'حدث خطأ أثناء رفع الصورة.';
    } finally {
      spinner.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.textContent = 'رفع الصورة';
    }
  });
});
