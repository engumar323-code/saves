from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / 'data.json'


def load_data():
    if DATA_FILE.exists():
        with DATA_FILE.open('r', encoding='utf-8') as f:
            return json.load(f)
    return {
        'users': [
            {'id': 'U001', 'name': 'Lubega Umar', 'email': 'lubega@thebridgemicrosaving.com', 'password': 'admin123', 'role': 'admin'},
            {'id': 'U002', 'name': 'Mercy', 'email': 'mercy@thebridgemicrosaving.com', 'password': 'treasurer123', 'role': 'officer'}
        ],
        'members': [
            {'id': 'M101', 'name': 'Lubega Umar', 'email': 'lubega@thebridgemicrosaving.com', 'phone': '+256700000001', 'address': 'Kampala', 'occupation': 'Administrator', 'status': 'active', 'joinDate': '2026-07-04'},
            {'id': 'M102', 'name': 'Mercy', 'email': 'mercy@thebridgemicrosaving.com', 'phone': '+256700000002', 'address': 'Kampala', 'occupation': 'Treasurer', 'status': 'active', 'joinDate': '2026-07-04'},
            {'id': 'M103', 'name': 'Semaganda Raymond', 'email': 'semaganda@thebridgemicrosaving.com', 'phone': '+256700000003', 'address': 'Mukono', 'occupation': 'Member', 'status': 'active', 'joinDate': '2026-07-04'},
            {'id': 'M104', 'name': 'Kimera Abdul Hakim', 'email': 'kimera@thebridgemicrosaving.com', 'phone': '+256700000004', 'address': 'Jinja', 'occupation': 'Member', 'status': 'active', 'joinDate': '2026-07-04'},
            {'id': 'M105', 'name': 'Aunt Betty', 'email': 'betty@thebridgemicrosaving.com', 'phone': '+256700000005', 'address': 'Masaka', 'occupation': 'Member', 'status': 'active', 'joinDate': '2026-07-04'}
        ],
        'savings': [],
        'loans': [],
        'transactions': [],
        'settings': {'orgName': 'The Bridge Micro Saving', 'orgEmail': 'info@coopsociety.org', 'orgPhone': '+1-800-123-4567', 'orgAddress': '123 Main Street, City, Country', 'defaultRate': 10, 'minLoan': 500, 'maxLoan': 50000}
    }


def save_data(data):
    with DATA_FILE.open('w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


@app.get('/')
def health():
    return jsonify({'status': 'ok', 'message': 'Backend running'})


@app.post('/login')
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get('email') or '').strip().lower()
    password = payload.get('password') or ''

    data = load_data()
    user = next((u for u in data['users'] if u['email'].lower() == email and u['password'] == password), None)

    if not user:
        return jsonify({'ok': False, 'message': 'Invalid email or password'}), 401

    return jsonify({'ok': True, 'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'role': user['role']}})


@app.get('/members')
def get_members():
    data = load_data()
    return jsonify({'members': data['members']})


@app.get('/data')
def get_data():
    return jsonify(load_data())


@app.post('/data')
def save_app_data():
    payload = request.get_json(silent=True) or {}
    save_data(payload)
    return jsonify({'ok': True})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
