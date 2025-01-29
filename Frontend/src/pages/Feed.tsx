import React, { useEffect, useState } from "react";
import axios from "axios";

const CLIENT_ID = "YOUR_NAVER_CLIENT_ID";  // 네이버 개발자센터에서 발급
const CLIENT_SECRET = "YOUR_NAVER_CLIENT_SECRET";  // 네이버 개발자센터에서 발급

interface BlogPost {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  postdate: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNaverBlogs = async () => {
      try {
        const query = "봉사 후기"; // 검색어
        const response = await axios.get("https://openapi.naver.com/v1/search/blog.json", {
          params: { query, display: 10, sort: "date" }, // 최신순 정렬
          headers: {
            "X-Naver-Client-Id": CLIENT_ID,
            "X-Naver-Client-Secret": CLIENT_SECRET,
          },
        });

        setPosts(response.data.items);
      } catch (error) {
        console.error("네이버 블로그 검색 API 호출 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNaverBlogs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">봉사 후기 블로그</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <ul>
          {posts.map((post, index) => (
            <li key={index} className="mb-4 p-2 border-b">
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                <h3 className="font-semibold" dangerouslySetInnerHTML={{ __html: post.title }}></h3>
              </a>
              <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: post.description }}></p>
              <p className="text-sm text-gray-500">블로거: {post.bloggername} | 작성일: {post.postdate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Feed;
