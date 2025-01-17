import json

# 봉사자 더미 데이터 생성
volunteers = [
    {"id": 1, "age": 25, "gender": "M", "region": "Seoul", "major": "CS"},
    {"id": 2, "age": 30, "gender": "F", "region": "Busan", "major": "Engineering"},
    {"id": 3, "age": 22, "gender": "M", "region": "Incheon", "major": "Education"},
    {"id": 4, "age": 27, "gender": "F", "region": "Seoul", "major": "Arts"}
]

# 공고 더미 데이터 생성
postings = [
    {"id": 101, "theme": "Education", "region": "Seoul", "difficulty": 3},
    {"id": 102, "theme": "Environment", "region": "Busan", "difficulty": 2},
    {"id": 103, "theme": "Health", "region": "Seoul", "difficulty": 4},
    {"id": 104, "theme": "IT", "region": "Incheon", "difficulty": 5}
]

# JSON 파일로 저장
with open("volunteers.json", "w") as v_file:
    json.dump(volunteers, v_file, indent=4)

with open("postings.json", "w") as p_file:
    json.dump(postings, p_file, indent=4)

print("봉사자와 공고 더미 데이터가 생성되었습니다!")
