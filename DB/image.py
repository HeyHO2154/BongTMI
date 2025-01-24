from bing_image_downloader import downloader
import os

def download_images(query, download_path, num_images=5):
    try:
        # 이미지 다운로드
        downloader.download(
            query,
            limit=num_images,
            output_dir=download_path,
            adult_filter_off=True,
            force_replace=False,
            timeout=60
        )
        print(f"이미지가 {download_path}에 저장되었습니다.")
    except Exception as e:
        print(f"이미지 다운로드 오류: {e}")

if __name__ == "__main__":
    # 사용자 바탕화면 경로
    desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
    query = "효사랑주간보호센터"
    download_images(query, desktop_path)
