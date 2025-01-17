import json
import numpy as np
import tensorflow as tf

# 모델 불러오기
model = tf.keras.models.load_model("volunteer_recommendation_model.h5")

# 봉사자 데이터 불러오기
with open("volunteers.json", "r") as v_file:
    volunteers = json.load(v_file)

# 공고 데이터 불러오기
with open("postings.json", "r") as p_file:
    postings = json.load(p_file)

# 사용자 입력 받기
volunteer_id = int(input("봉사자 ID를 입력하세요: "))
candidate_postings = np.array([p["id"] for p in postings])

# 예측
predictions = model.predict([np.full(len(candidate_postings), volunteer_id), candidate_postings])
recommended_postings = candidate_postings[np.argsort(-predictions.flatten())]

# 추천 결과 출력
print("추천 공고:")
for posting_id in recommended_postings:
    posting = next(p for p in postings if p["id"] == posting_id)
    print(f"- ID: {posting['id']}, 주제: {posting['theme']}, 지역: {posting['region']}, 난이도: {posting['difficulty']}")
