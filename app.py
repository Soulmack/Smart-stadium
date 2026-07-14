from flask import Flask, render_template
from backend.routes import api_bp

app = Flask(__name__)

# Register API Blueprint
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def dashboard():
    """Serves the main accessible frontend dashboard."""
    return render_template('index.html')

if __name__ == '__main__':
    # Run the Flask development server
    app.run(debug=True, host='127.0.0.1', port=5000)
