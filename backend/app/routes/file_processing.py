from flask import Blueprint, request, jsonify
import subprocess
import os
from werkzeug.utils import secure_filename
from app.config import Config

file_bp = Blueprint('file_processing', __name__)

@file_bp.route('/api/process_file', methods=['POST'])
def process_file_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if not file.filename.endswith('.txt'):
        return jsonify({'error': 'Invalid file format'}), 400

    input_path = os.path.join(Config.UPLOAD_FOLDER, secure_filename(file.filename))
    output_path = os.path.join(Config.UPLOAD_FOLDER, 'output.txt')
    
    try:
        file.save(input_path)
        # Run the C executable directly
        subprocess.run([Config.C_EXECUTABLE_PATH, input_path, output_path])
        os.remove(input_path)  # Clean up input file
        return jsonify({'message': 'Success'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500