import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split

# 경로 설정
file_path = r"C:\Users\PRO\Desktop\A_B_data.xlsx"

# 1. 데이터 생성 및 엑셀 저장
def generate_and_save_data(file_path):
    np.random.seed(42)

    # A 데이터 생성 (사용자 특성)
    num_A = 5000
    ages = np.random.randint(20, 61, size=num_A)  # 나이: 20~60
    regions = np.random.randint(0, 7, size=num_A)  # 지역: 0~6 (서울~제주)
    genders = np.random.randint(0, 2, size=num_A)  # 성별: 0(남), 1(여)

    # B 데이터 생성 (봉사활동 정보)
    num_B = 100
    durations = np.random.randint(1, 31, size=num_B)  # 봉사기간: 1~30일
    recognitions = np.random.choice([True, False], size=num_B)  # 봉사시간 인정 여부
    contents = [
        "미용 봉사 - 지역 주민 대상 무료 미용 서비스 제공",
        "청소년 학습 보조 - 학업 도움 및 멘토링 제공",
        "재활원 보조 도우미 - 장애인 시설에서 보조 역할 수행",
        "환경 정화 활동 - 공원과 거리 청소 및 정화",
        "동물 보호소 봉사 - 유기 동물 돌보기 및 환경 개선",
        "노인 돌봄 봉사 - 독거노인 가사 및 말벗 지원",
        "병원 봉사 - 환자 안내 및 지원 업무",
        "지역 축제 봉사 - 행사 진행 및 참가자 안내",
        "도서관 업무 보조 - 자료 정리 및 방문자 안내",
        "문화 행사 보조 - 공연장 청소 및 관람객 지원",
    ]
    contents = [contents[i % len(contents)] for i in range(num_B)]

    # A와 B 매핑 정보 생성
    A_to_B = [
        np.random.choice(range(num_B), size=np.random.randint(0, 6), replace=False).tolist()
        for _ in range(num_A)
    ]

    # A 데이터프레임 생성
    region_map = ['서울', '경기', '충청', '경상', '강원', '전라', '제주']
    A_data = pd.DataFrame({
        'A_ID': [f"A_{i+1}" for i in range(num_A)],
        '나이': ages,
        '지역': [region_map[r] for r in regions],
        '성별': ['남' if g == 0 else '여' for g in genders],
        '선택한 B_ID': [", ".join([f"B_{b+1}" for b in b_list]) for b_list in A_to_B]
    })

    # B 데이터프레임 생성
    B_data = pd.DataFrame({
        'B_ID': [f"B_{i+1}" for i in range(num_B)],
        '봉사기간': durations,
        '봉사시간 인정 여부': recognitions,
        '봉사내용': contents
    })

    # 엑셀 파일로 저장
    with pd.ExcelWriter(file_path) as writer:
        A_data.to_excel(writer, sheet_name='A', index=False)
        B_data.to_excel(writer, sheet_name='B', index=False)

    print(f"데이터가 엑셀 파일로 저장되었습니다: {file_path}")

# 2. 엑셀 파일 불러오기
def load_data_from_excel(file_path):
    # A 데이터 읽기
    A_data = pd.read_excel(file_path, sheet_name='A')
    # B 데이터 읽기
    B_data = pd.read_excel(file_path, sheet_name='B')

    # A 데이터 처리 (나이, 지역, 성별)
    region_map = {'서울': 0, '경기': 1, '충청': 2, '경상': 3, '강원': 4, '전라': 5, '제주': 6}
    A_data['지역'] = A_data['지역'].map(region_map)  # 지역을 숫자로 변환
    A_data['성별'] = A_data['성별'].map({'남': 0, '여': 1})  # 성별 변환

    # A 데이터 One-hot Encoding
    A_data_one_hot = pd.get_dummies(A_data, columns=['지역'], prefix='지역')
    
    # A_ID와 선택한 B_ID를 제외하고 A 데이터를 float32로 변환
    A_array = A_data_one_hot.drop(columns=['A_ID', '선택한 B_ID']).to_numpy().astype(np.float32)

    # B 선택 여부를 저장할 배열 초기화
    B_labels = np.zeros((len(A_data), len(B_data)))

    # A와 B 매핑 정보로 B_labels 생성
    for idx, selected in enumerate(A_data['선택한 B_ID']):
        if isinstance(selected, str) and selected.strip():
            selected_list = selected.split(", ")
            for b in selected_list:
                b_index = B_data[B_data['B_ID'] == b].index[0]
                B_labels[idx][b_index] = 1

    return A_array, B_labels, B_data

# 3. 모델 정의 및 학습
def train_model(A_array, B_array):
    # 데이터 분리
    X_train, X_test, y_train, y_test = train_test_split(A_array, B_array, test_size=0.2, random_state=42)

    # 모델 정의
    model = Sequential([
        Dense(64, activation='relu', input_dim=X_train.shape[1]),  # 입력층
        Dense(128, activation='relu'),  # 은닉층
        Dense(B_array.shape[1], activation='sigmoid')  # 출력층 (B 개수만큼의 확률)
    ])

    model.compile(optimizer=Adam(learning_rate=0.0005), loss='binary_crossentropy', metrics=['accuracy'])
    model.fit(X_train, y_train, epochs=100, batch_size=8, validation_data=(X_test, y_test))

    return model

# 4. 사용자 입력 받기
def get_user_input():
    print("사용자 정보를 입력하세요:")
    age = int(input("나이 (숫자로 입력, 예: 25): "))
    region = input("지역 (서울/경기/충청/경상/강원/전라/제주): ")
    gender = input("성별 (남/여): ")

    # 지역과 성별 변환
    region_map = {'서울': 0, '경기': 1, '충청': 2, '경상': 3, '강원': 4, '전라': 5, '제주': 6}
    gender_map = {'남': 0, '여': 1}

    region_encoded = [0] * 7
    region_encoded[region_map[region]] = 1  # One-hot Encoding
    gender_encoded = gender_map[gender]

    # A_user 데이터 생성 (나이 + 지역 One-hot + 성별)
    A_user = np.array([age] + region_encoded + [gender_encoded]).astype(np.float32)
    return A_user

# 5. B 예측 (봉사시간 인정 여부와 봉사기간 출력 포함)
def predict_B(model, A_user, B_data, top_k=5):
    prediction = model.predict(A_user.reshape(1, -1))[0]
    print("\n모델 예측값:")
    for idx, pred in enumerate(prediction):
        print(f"B_{idx+1}: {pred:.4f}")

    # 상위 top_k 추천
    top_indices = prediction.argsort()[-top_k:][::-1]
    print("\n추천 봉사 활동:")
    has_recommendation = False
    for i in top_indices:
        has_recommendation = True
        print(f"- 봉사내용: {B_data.iloc[i]['봉사내용']}")
        print(f"  봉사기간: {B_data.iloc[i]['봉사기간']}일")
        print(f"  봉사시간 인정 여부: {'인정' if B_data.iloc[i]['봉사시간 인정 여부'] else '미인정'}")
        print("")

    if not has_recommendation:
        print("추천할 봉사 활동이 없습니다.")

# 실행
generate_and_save_data(file_path)  # 데이터 생성 및 저장
A_array, B_array, B_data = load_data_from_excel(file_path)  # 엑셀 파일 불러오기
model = train_model(A_array, B_array)  # 모델 학습

# 사용자 입력 및 예측
A_user = get_user_input()  # 사용자 입력
predict_B(model, A_user, B_data)   # 예측
