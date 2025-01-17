import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Embedding, Flatten, Dense, Concatenate

# 데이터 불러오기
with open("volunteers.json", "r") as v_file:
    volunteers = json.load(v_file)

with open("postings.json", "r") as p_file:
    postings = json.load(p_file)

# 더미 상호작용 데이터 생성 (Positive Samples)
interactions = [
    {"volunteer_id": 1, "posting_id": 101, "interaction": 1},
    {"volunteer_id": 1, "posting_id": 103, "interaction": 1},
    {"volunteer_id": 2, "posting_id": 102, "interaction": 1},
    {"volunteer_id": 3, "posting_id": 104, "interaction": 1},
    {"volunteer_id": 4, "posting_id": 101, "interaction": 1},
]

# 데이터 전처리
volunteer_ids = np.array([i["volunteer_id"] for i in interactions])
posting_ids = np.array([i["posting_id"] for i in interactions])
labels = np.array([i["interaction"] for i in interactions])

num_volunteers = max(volunteer_ids) + 1
num_postings = max(posting_ids) + 1
embedding_dim = 8

# 모델 정의
volunteer_input = Input(shape=(1,), name="volunteer_input")
posting_input = Input(shape=(1,), name="posting_input")

volunteer_embedding = Embedding(num_volunteers, embedding_dim, name="volunteer_embedding")(volunteer_input)
posting_embedding = Embedding(num_postings, embedding_dim, name="posting_embedding")(posting_input)

volunteer_vec = Flatten()(volunteer_embedding)
posting_vec = Flatten()(posting_embedding)

concat = Concatenate()([volunteer_vec, posting_vec])
hidden = Dense(64, activation="relu")(concat)
output = Dense(1, activation="sigmoid")(hidden)

model = Model(inputs=[volunteer_input, posting_input], outputs=output)
model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
model.summary()

# 모델 학습
model.fit([volunteer_ids, posting_ids], labels, epochs=10, batch_size=2)

# 모델 저장
model.save("volunteer_recommendation_model.h5")
print("AI 모델이 저장되었습니다!")
