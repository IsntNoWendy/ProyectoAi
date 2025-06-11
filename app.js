document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const takePhotoBtn = document.getElementById('takePhotoBtn');
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const fileInput = document.getElementById('fileInput');
    const cameraModal = document.getElementById('cameraModal');
    const cameraPreview = document.getElementById('cameraPreview');
    const captureCanvas = document.getElementById('captureCanvas');
    const captureBtn = document.getElementById('captureBtn');
    const closeCameraBtn = document.getElementById('closeCameraBtn');
    const closeBtn = document.querySelector('.close');
    const notification = document.getElementById('notification');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const imageInfo = document.getElementById('imageInfo');
    const clearPreview = document.getElementById('clearPreview');
    
    let mediaStream = null;
    
    // Event listeners
    takePhotoBtn.addEventListener('click', openCamera);
    uploadPhotoBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    captureBtn.addEventListener('click', capturePhoto);
    closeCameraBtn.addEventListener('click', closeCamera);
    closeBtn.addEventListener('click', closeCamera);
    clearPreview.addEventListener('click', clearImagePreview);
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === cameraModal) {
            closeCamera();
        }
    });
    
    // Función para abrir la cámara
    async function openCamera() {
        try {
            // Solicitar acceso a la cámara
            mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                } 
            });
            
            cameraPreview.srcObject = mediaStream;
            cameraModal.style.display = 'block';
            
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            showNotification('Error al acceder a la cámara. Verifique los permisos.', 'error');
        }
    }
    
    // Función para cerrar la cámara
    function closeCamera() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
        cameraModal.style.display = 'none';
    }
    
    // Función para capturar foto
    function capturePhoto() {
        if (!mediaStream) {
            showNotification('No hay conexión con la cámara', 'error');
            return;
        }
        
        // Configurar canvas con las dimensiones del video
        const canvas = captureCanvas;
        const context = canvas.getContext('2d');
        const video = cameraPreview;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Dibujar el frame actual del video en el canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convertir a base64
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Enviar imagen al servidor
        fetch('/capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(data.message, 'success');
                closeCamera();
                // Mostrar vista previa de la imagen capturada
                showImagePreview(imageData, 'Foto capturada', 'Capturada desde cámara');
            } else {
                showNotification(data.error || 'Error al capturar foto', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error al procesar la foto capturada', 'error');
        });
    }
    
    // Función para manejar la subida de archivos
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validar tamaño del archivo (10MB máximo)
        if (file.size > 10 * 1024 * 1024) {
            showNotification('El archivo es demasiado grande. Máximo 10MB permitido.', 'error');
            return;
        }
        
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showNotification('Formato de archivo no válido. Use JPEG, PNG o WebP.', 'error');
            return;
        }
        
        // Crear FormData y enviar archivo
        const formData = new FormData();
        formData.append('file', file);
        
        // Mostrar indicador de carga
        showNotification('Subiendo archivo...', 'info');
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(data.message, 'success');
                // Mostrar vista previa del archivo subido
                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
                    showImagePreview(e.target.result, file.name, `Tamaño: ${fileSize}`);
                };
                reader.readAsDataURL(file);
            } else {
                showNotification(data.error || 'Error al subir archivo', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error al subir el archivo', 'error');
        });
        
        // Limpiar input
        fileInput.value = '';
    }
    
    // Función para mostrar notificaciones
    function showNotification(message, type = 'info') {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Función para mostrar vista previa de imagen
    function showImagePreview(imageSrc, fileName, info) {
        previewImage.src = imageSrc;
        imageInfo.textContent = `${fileName} - ${info}`;
        imagePreview.style.display = 'block';
        
        // Hacer scroll hacia la vista previa
        imagePreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Función para limpiar la vista previa
    function clearImagePreview() {
        previewImage.src = '';
        imageInfo.textContent = '';
        imagePreview.style.display = 'none';
    }
    
    // Verificar soporte de getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia no es compatible con este navegador');
        takePhotoBtn.disabled = true;
        takePhotoBtn.textContent = 'Cámara no disponible';
        takePhotoBtn.style.opacity = '0.5';
        takePhotoBtn.style.cursor = 'not-allowed';
    }
}); 