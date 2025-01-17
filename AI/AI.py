import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding, Flatten
from sklearn.preprocessing import LabelEncoder

# 데이터셋 준비
data = {'a': [3, 2], 'b': [5], 'c': [7]}
X = []
y = []

for key, values in data.items():
    for value in values:
        X.append(key)
        y.append(value)

X = np.array(X)
y = np.array(y)

# 데이터 전처리 (Label Encoding)
encoder = LabelEncoder()
X_encoded = encoder.fit_transform(X)  # 알파벳 -> 정수로 변환
X_encoded = X_encoded.reshape(-1, 1)

# 모델 설계
model = Sequential([
    Embedding(input_dim=len(encoder.classes_), output_dim=8, input_length=1),
    Flatten(),
    Dense(16, activation='relu'),
    Dense(1)  # 회귀 출력
])

model.compile(optimizer='adam', loss='mse')
model.summary()

# 학습
model.fit(X_encoded, y, epochs=50, verbose=1)

# 모델 저장
model.save('alphabet_to_number_model.h5')

# 예측
def predict_value(input_char):
    input_encoded = encoder.transform([input_char])  # 입력 변환
    input_encoded = np.array(input_encoded).reshape(-1, 1)
    prediction = model.predict(input_encoded)
    return prediction[0][0]

# 테스트
print("예측 결과:", predict_value('a'))
