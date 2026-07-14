from flask import Blueprint, jsonify, request
from .mock_data import generate_crowd_data, generate_energy_data
from .auth import is_authorized, validate_incident_report

api_bp = Blueprint('api', __name__)

@api_bp.route('/data/crowd', methods=['GET'])
def get_crowd_data():
    """Returns real-time crowd and gate management data."""
    return jsonify({
        'status': 'success',
        'data': generate_crowd_data()
    })

@api_bp.route('/data/energy', methods=['GET'])
def get_energy_data():
    """Returns real-time energy consumption data."""
    return jsonify({
        'status': 'success',
        'data': generate_energy_data()
    })

@api_bp.route('/incidents', methods=['POST'])
def report_incident():
    """
    Secure portal for staff to log operational issues.
    Requires Authorization header.
    """
    # 1. Check Authorization
    if not is_authorized(request):
        return jsonify({'status': 'error', 'message': 'Unauthorized. Invalid or missing token.'}), 401
        
    # 2. Get JSON data
    data = request.get_json()
    
    # 3. Validate input
    is_valid, msg = validate_incident_report(data)
    if not is_valid:
        return jsonify({'status': 'error', 'message': msg}), 400
        
    # 4. In a real app, save to database here. We'll just mock success.
    # We can print to server logs
    print(f"New Incident Logged: {data['title']} (Severity: {data['severity']})")
    
    return jsonify({
        'status': 'success',
        'message': 'Incident reported successfully.',
        'incident_id': 'INC-' + str(int(data.get('title', '0').__hash__()) % 10000).zfill(4)
    }), 201
