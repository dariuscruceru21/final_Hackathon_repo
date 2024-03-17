import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
from flask import Flask, request, jsonify
# Load the data
# Load the data
data = pd.read_csv('meeting-rooms.csv', parse_dates=['date'])

# Preprocess the data
data.fillna(0, inplace=True)
data['date'] = pd.to_datetime(data['date'], format='%d/%m/%Y')
data['date'] = data['date'].dt.dayofyear

# Check if columns exist before mapping
for column in ['nineToEleven', 'elevenToOne', 'oneToThree', 'threeToFive']:
    if column in data.columns:
        data[column] = data[column].map({True: 1, False: 0})

# Convert room names to numerical values
le = LabelEncoder()
data['room'] = le.fit_transform(data['room'])

# Define features and target
X = data.drop('attendanceNineToEleven', axis=1)
y = data['attendanceNineToEleven']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the model
model = RandomForestRegressor(n_estimators=100)

# training the model
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
r2 = r2_score(y_test, predictions)
print('R-squared:',round((r2 * 100),2), '%')

joblib.dump(model, 'random_forest_regressor.pkl')
print()
'''
second 
'''
# Load the data
data = pd.read_csv('hackathon-schema.csv')

# Preprocess the data
data['firstHalf'] = data['firstHalf'].map({True: 1, False: 0})
data['secondHalf'] = data['secondHalf'].map({True: 1, False: 0})

# Convert desk names to numerical values
le = LabelEncoder()
data['desk'] = le.fit_transform(data['desk'])

# Define features and target
X = data[['desk', 'firstHalf']]
y = data['secondHalf']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Define the model
model = RandomForestClassifier(n_estimators=100)

# Train the model
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test,predictions)
# Print predictions
print('Accuracy:',round((accuracy)*100,2),'%')
print()

joblib.dump(model, 'random_forest_classifier.pkl')
# Load the first model
model1 = joblib.load('random_forest_regressor.pkl')
# Load the second model
model2 = joblib.load('random_forest_classifier.pkl')


def make_prediction(input_data):
    # Load the model
    model = joblib.load('model.pkl')
    # Make prediction
    prediction = model.predict(input_data)
    return prediction

app = Flask(__name__)
@app.route('/predict', methods=['POST'])
def predict():
    # Get input data from request
    input_data = request.json
    # Make prediction
    prediction = make_prediction(input_data)
    # Send prediction as response
    return jsonify(prediction)