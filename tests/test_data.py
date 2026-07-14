import unittest
from backend.mock_data import generate_crowd_data, generate_energy_data
from backend.auth import validate_incident_report, is_authorized

class TestDataGeneration(unittest.TestCase):
    def test_generate_crowd_data(self):
        data = generate_crowd_data()
        self.assertEqual(len(data), 4) # 4 gates
        self.assertIn('gate', data[0])
        self.assertIn('entries_per_min', data[0])
        self.assertIn('bottleneck_status', data[0])
        
    def test_generate_energy_data(self):
        data = generate_energy_data()
        self.assertEqual(len(data), 5) # 5 sectors
        self.assertIn('total_kwh', data[0])
        self.assertTrue(data[0]['total_kwh'] > 0)

class TestAuthAndValidation(unittest.TestCase):
    def test_validate_incident_valid(self):
        valid_data = {
            'title': 'Broken Gate Scanner',
            'severity': 'high',
            'description': 'Scanner at North Gate is not responding.'
        }
        is_valid, msg = validate_incident_report(valid_data)
        self.assertTrue(is_valid)

    def test_validate_incident_invalid_severity(self):
        invalid_data = {
            'title': 'Broken Gate Scanner',
            'severity': 'super-critical',
            'description': 'Scanner at North Gate is not responding.'
        }
        is_valid, msg = validate_incident_report(invalid_data)
        self.assertFalse(is_valid)
        self.assertIn('Invalid severity level', msg)

    def test_validate_incident_missing_fields(self):
        invalid_data = {
            'title': 'Missing fields'
        }
        is_valid, msg = validate_incident_report(invalid_data)
        self.assertFalse(is_valid)
        self.assertIn('Missing required fields', msg)
        
    def test_validate_incident_html_injection(self):
        invalid_data = {
            'title': '<script>alert(1)</script>',
            'severity': 'high',
            'description': 'Malicious payload'
        }
        is_valid, msg = validate_incident_report(invalid_data)
        self.assertFalse(is_valid)
        self.assertIn('HTML tags are not allowed', msg)

if __name__ == '__main__':
    unittest.main()
