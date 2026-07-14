import unittest
import json
from app import app

class TestAPIEndpoints(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    def test_get_crowd_data(self):
        response = self.client.get('/api/data/crowd')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')
        self.assertTrue(len(data['data']) > 0)

    def test_get_energy_data(self):
        response = self.client.get('/api/data/energy')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')
        self.assertTrue(len(data['data']) > 0)

    def test_post_incident_unauthorized(self):
        # Missing auth header
        response = self.client.post('/api/incidents', json={
            'title': 'Test',
            'severity': 'low',
            'description': 'Test description'
        })
        self.assertEqual(response.status_code, 401)
        
    def test_post_incident_authorized(self):
        response = self.client.post('/api/incidents', 
            json={
                'title': 'Test Incident',
                'severity': 'low',
                'description': 'Test description'
            },
            headers={'Authorization': 'Bearer st4d1um_s3cur3_t0k3n_2026'}
        )
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')
        self.assertIn('incident_id', data)

if __name__ == '__main__':
    unittest.main()
