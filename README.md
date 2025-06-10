# Aplicación de Captura y Subida de Fotos

Una aplicación web moderna que permite a los usuarios capturar fotos directamente desde su cámara web o subir archivos de imagen para análisis de IA. La interfaz está completamente en español y replica el diseño mostrado en la especificación.

## Características

- 📸 **Captura de fotos en tiempo real** desde la cámara web
- 📁 **Subida de archivos** con validación de formato y tamaño
- 🎨 **Diseño moderno y responsivo** que replica la interfaz original
- ✅ **Validación de archivos**: JPEG, PNG, WebP (máximo 10MB)
- 🔔 **Notificaciones en tiempo real** para feedback del usuario
- 📱 **Compatible con dispositivos móviles**

## Requisitos del Sistema

- Python 3.7 o superior
- Navegador web moderno con soporte para getUserMedia
- Cámara web (opcional, para la función de captura)

## Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd ruta/del/proyecto
   ```

2. **Crear un entorno virtual (recomendado)**
   ```bash
   python -m venv venv
   
   # En Windows:
   venv\Scripts\activate
   
   # En macOS/Linux:
   source venv/bin/activate
   ```

3. **Instalar las dependencias**
   ```bash
   pip install -r requirements.txt
   ```

## Ejecutar la Aplicación

1. **Iniciar el servidor Flask**
   ```bash
   python app.py
   ```

2. **Abrir en el navegador**
   - Ir a: `http://localhost:5000`
   - La aplicación estará disponible en la dirección local

## Uso de la Aplicación

### Capturar Foto
1. Hacer clic en el botón azul **"Tomar Foto"**
2. Conceder permisos de acceso a la cámara cuando se solicite
3. Una vez que aparezca la vista previa, hacer clic en **"Capturar"**
4. La foto se guardará automáticamente en la carpeta `uploads/`

### Subir Archivo
1. Hacer clic en el botón **"Subir Foto"**
2. Seleccionar un archivo de imagen desde su dispositivo
3. Los formatos aceptados son: JPEG, PNG, WebP
4. Tamaño máximo: 10MB

## Estructura del Proyecto

```
proyecto/
├── app.py                 # Aplicación Flask principal
├── requirements.txt       # Dependencias de Python
├── README.md             # Este archivo
├── templates/
│   └── index.html        # Template HTML principal
├── static/
│   ├── css/
│   │   └── styles.css    # Estilos CSS
│   └── js/
│       └── app.js        # Lógica JavaScript
└── uploads/              # Carpeta para archivos subidos (se crea automáticamente)
```

## Funcionalidades Técnicas

- **Backend**: Flask con endpoints RESTful
- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Cámara**: WebRTC getUserMedia API
- **Validación**: Lado cliente y servidor
- **Almacenamiento**: Sistema de archivos local
- **Seguridad**: Validación de tipos de archivo y tamaños

## Guías de Foto (Incluidas en la Interfaz)

✅ Use formato JPEG, PNG, o WebP  
✅ Asegure buenas condiciones de iluminación  
✅ Mantenga la imagen enfocada y clara  
✅ El tamaño del archivo debe ser menor a 10MB  

## Resolución de Problemas

### La cámara no funciona
- Verificar que el navegador tenga permisos para acceder a la cámara
- Asegurar que no haya otras aplicaciones usando la cámara
- Usar HTTPS en producción (requerido por algunos navegadores)

### Error al subir archivos
- Verificar que el archivo sea menor a 10MB
- Confirmar que el formato sea JPEG, PNG o WebP
- Revisar los permisos de escritura en la carpeta del proyecto

## Personalización

Para modificar el diseño o funcionalidad:
- **Estilos**: Editar `static/css/styles.css`
- **Lógica**: Modificar `static/js/app.js`
- **Backend**: Actualizar `app.py`

## Tecnologías Utilizadas

- **Flask** - Framework web de Python
- **HTML5** - Estructura y canvas para captura
- **CSS3** - Estilos y animaciones modernas
- **JavaScript** - Funcionalidad del cliente
- **WebRTC** - Acceso a cámara web 