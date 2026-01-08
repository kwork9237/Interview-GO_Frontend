import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import Button from '../../components/common/Button';

const YoutubeSection = () => {
  const [videoList, setVideoList] = useState([]);
  // 현재 선택된 카테고리를 저장하는 상태 (기본값: 면접 꿀팁)
  const [activeCategory, setActiveCategory] = useState("면접 꿀팁");

  // 버튼으로 만들 카테고리 리스트 (백엔드와 동일하게 설정)
  const categories = ["면접 꿀팁", "개발자 기술면접", "자기소개서 작성법"];

  useEffect(() => {
    // 2. activeCategory가 변경될 때마다 서버에 해당 데이터를 요청합니다.
    axios.get(`/api/admin/youtube/check`, {
      params: { category: activeCategory } // 서버의 @RequestParam(value="category")로 전달됨
    })
      .then(response => {
        setVideoList(response.data);
      })
      .catch(error => {
        console.error("데이터 호출 실패:", error);
      });
  }, [activeCategory]); // 3. 이 배열 안에 있는 값이 변하면 useEffect가 다시 실행

  const opts = {
    height: '240',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 rounded-2xl shadow-inner my-10 mb-4">
      <h2 className="text-3xl font-black text-gray-900 mb-6 border-l-8 border-blue-600 pl-4">
        오늘의 취업 추천 영상
      </h2>

      {/* 4. 카테고리 선택 버튼 메뉴바 */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "primary" : "outline"}
            size = "medium"
            onClick={() => setActiveCategory(cat)} // 버튼 클릭 시 상태 변경
          >
            {cat}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoList.length > 0 ? (
          videoList.map((video, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-md hover:-translate-y-2 transition-transform border border-gray-100">
              <div className="rounded-lg overflow-hidden shadow-sm">
                <YouTube videoId={video.ytKey} opts={opts} />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-400 font-medium">
            영상을 불러오는 중이거나 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeSection;