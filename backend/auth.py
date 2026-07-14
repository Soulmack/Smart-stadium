import re

def is_authorized(request):
    """
    Simulates a secure auth flow by checking for a mock Bearer token.
    In a real app, this would validate a JWT or session token against a DB.
    """
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header == 'Bearer st4d1um_s3cur3_t0k3n_2026':
        return True
    return False

def validate_incident_report(data):
    """
    Basic input validation for an incident report.
    Returns (True, "Valid") if OK, else (False, "Error message")
    """
    if not data:
        return False, "No data provided."
        
    title = data.get('title', '')
    description = data.get('description', '')
    severity = data.get('severity', '')
    
    if not title or not description or not severity:
        return False, "Missing required fields (title, description, severity)."
        
    if len(title) > 100:
        return False, "Title exceeds maximum length of 100 characters."
        
    if len(description) > 1000:
        return False, "Description exceeds maximum length of 1000 characters."
        
    # Basic sanitize: remove potential HTML tags (very basic example)
    if re.search(r'<[^>]*>', title) or re.search(r'<[^>]*>', description):
        return False, "HTML tags are not allowed in input fields."
        
    valid_severities = ['low', 'medium', 'high', 'critical']
    if severity.lower() not in valid_severities:
        return False, f"Invalid severity level. Must be one of: {', '.join(valid_severities)}"
        
    return True, "Valid"
