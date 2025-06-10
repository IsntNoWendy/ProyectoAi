from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import uuid
from werkzeug.utils import secure_filename
import base64
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tu_clave_secreta_aqui'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB máximo

# Crear directorio de uploads si no existe
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Formatos permitidos
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No se ha seleccionado ningún archivo'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No se ha seleccionado ningún archivo'}), 400
        
        if file and allowed_file(file.filename):
            # Generar nombre único para el archivo
            filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            return jsonify({
                'success': True,
                'message': 'Foto subida exitosamente',
                'filename': filename
            })
        else:
            return jsonify({'error': 'Formato de archivo no permitido. Use JPEG, PNG o WebP'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Error al subir archivo: {str(e)}'}), 500

@app.route('/capture', methods=['POST'])
def capture_photo():
    try:
        data = request.json
        if 'image' not in data:
            return jsonify({'error': 'No se recibió imagen'}), 400
        
        # Decodificar imagen base64
        image_data = data['image'].split(',')[1]  # Remover data:image/jpeg;base64,
        image_bytes = base64.b64decode(image_data)
        
        # Generar nombre único
        filename = f"capture_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Guardar imagen
        with open(filepath, 'wb') as f:
            f.write(image_bytes)
        
        return jsonify({
            'success': True,
            'message': 'Foto capturada exitosamente',
            'filename': filename
        })
        
    except Exception as e:
        return jsonify({'error': f'Error al capturar foto: {str(e)}'}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 