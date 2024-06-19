from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Lecture du fichier Excel
file_path = 'programme_entrainement_semi_marathon_20_semaines.xlsx'
df = pd.read_excel(file_path)

@app.route('/data', methods=['GET'])
def get_data():
    data = df.to_dict(orient='records')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
