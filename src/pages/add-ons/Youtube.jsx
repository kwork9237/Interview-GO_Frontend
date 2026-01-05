import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import Button from '../../components/common/Button';

/**
 * 사용자가 선택한 카테고리에 맞는 취업 관련 유튜브 영상을 
 * 백엔드 API로부터 불러와 3열 그리드 형태로 출력.
 */
const YoutubeSection = () => {
  // 서버로부터 받아온 영상 리스트(ytKey 등)를 저장하는 상태
  const [videoList, setVideoList] = useState([]);
  
  // 현재 활성화된 탭(카테고리) 상태 관리 (기본값: '면접 꿀팁')
  const [activeCategory, setActiveCategory] = useState("면접 꿀팁");

  // 백엔드(YoutubeService)의 CATEGORIES와 매칭되는 버튼 리스트
  const categories = ["면접 꿀팁", "개발자 기술면접", "자기소개서 작성법"];

  /**
   * activeCategory 상태가 변경될 때마다 실행되는 Side Effect입니다.
   */
  useEffect(() => {
    // 백엔드의 @GetMapping("/check") 엔드포인트에 카테고리 파라미터를 담아 요청
    axios.get(`http://localhost:8080/api/youtube/check`, {
      params: { category: activeCategory } 
    })
      .then(response => {
        // 서버에서 받아온 6개의 영상 데이터를 상태에 반영
        setVideoList(response.data);
      })
      .catch(error => {
        console.error("유튜브 데이터 호출 실패:", error);
      });
  }, [activeCategory]); // 의존성 배열: 카테고리 버튼을 누를 때마다 이 내부 로직이 재실행됨

  /**
   * [react-youtube 플레이어 설정]
   * 가로 100% 대응 및 자동재생 비활성화(0) 설정
   */
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
        오늘의 면접 추천 영상
      </h2>

      {/*현재 선택된 카테고리에 따라 버튼 스타일(variant)을 동적으로 변경 */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <Button
            key={cat}
            // 선택된 버튼은 'primary', 나머지는 'outline' 디자인 적용
            variant={activeCategory === cat ? "primary" : "outline"}
            size = "medium"
            // 클릭 시 activeCategory 상태를 변경하여 useEffect를 트리거함
            onClick={() => setActiveCategory(cat)} 
          >
            {cat}
          </Button>
        ))}
      </div>
      
      {/* [영상 리스트 그리드]
          반응형 설정: 모바일(1열), 태블릿(2열), 데스크탑(3열) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoList.length > 0 ? (
          videoList.map((video, index) => (
            // 호버 시 위로 살짝 뜨는 애니메이션 효과 적용
            <div key={index} className="bg-white p-4 rounded-xl shadow-md hover:-translate-y-2 transition-transform border border-gray-100">
              <div className="rounded-lg overflow-hidden shadow-sm">
                {/* 유튜브 고유 키(ytKey)를 전달하여 임베드 플레이어 생성 */}
                <YouTube videoId={video.ytKey} opts={opts} />
              </div>
            </div>
          ))
        ) : (
          // 데이터 로딩 중이거나 응답이 없을 때 표시할 UI
          <div className="col-span-full text-center py-20 text-gray-400 font-medium">
            영상을 불러오는 중이거나 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeSection;