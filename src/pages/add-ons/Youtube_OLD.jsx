import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import Button from '../../components/common/Button';

/**
 * 유튜브 섹션 컴포넌트
 * 메뉴 광클 시 발생하는 'playVideo' null 에러 방지 로직 포함
 */
const YoutubeSection = () => {
  // 서버로부터 받아온 영상 리스트(ytKey 등)를 저장하는 상태
  const [videoList, setVideoList] = useState([]);
  // 현재 활성화된 탭(카테고리) 상태 관리 (기본값: '면접 꿀팁')
  const [activeCategory, setActiveCategory] = useState("면접 꿀팁");
  // 백엔드(YoutubeService)의 CATEGORIES와 매칭되는 버튼 리스트
  const categories = ["면접 꿀팁", "개발자 기술면접", "자기소개서 작성법"];

  // [안전장치 1] 생성된 모든 플레이어 객체를 추적하는 명단
  const playerRefs = useRef([]);
  
  // [안전장치 2] 컴포넌트가 현재 화면에 존재하는지 체크 (광클 에러 방지 핵심)
  const isMounted = useRef(true);

  /**
   * 카테고리 변경 시 영상 목록 호출
   */
  useEffect(() => {
    isMounted.current = true; // 컴포넌트 등장
    // 백엔드의 @GetMapping("/check") 엔드포인트에 카테고리 파라미터를 담아 요청
    axios.get(`http://localhost:8080/api/youtube/check`, {
      params: { category: activeCategory } 
    })
      .then(response => {
        // 컴포넌트가 살아있을 때만 상태 업데이트 (메모리 누수 방지)
        if (isMounted.current) {
          setVideoList(response.data);
        }
      })
      .catch(error => {
        console.error("유튜브 데이터 호출 실패:", error);
      });

    // [뒷정리 로직] 메뉴 이동 등으로 컴포넌트가 사라질 때 실행
    return () => {
      isMounted.current = false; // 퇴장 깃발 올리기
      
      console.log("화면 전환 감지: 모든 유튜브 플레이어를 안전하게 파괴합니다. 🧹");
      
      // 명단에 있는 모든 플레이어를 물리적으로 제거
      playerRefs.current.forEach(player => {
        if (player && typeof player.destroy === 'function') {
          try {
            player.destroy(); // 이 명령이 playVideo 에러를 원천 차단함
          } catch (e) {
            // 이미 파괴된 경우 무시
          }
        }
      });
      playerRefs.current = []; // 명단 초기화
    };
  }, [activeCategory]);
  // 의존성 배열: 카테고리 버튼을 누를 때마다 이 내부 로직이 재실행됨

  /**
   * 플레이어 준비 시 실행되는 콜백
   */
  const onReady = (event) => {
    // [중요] 이미 화면을 떠났다면 플레이어를 즉시 파괴하고 종료
    if (!isMounted.current) {
      if (event.target && event.target.destroy) {
        event.target.destroy();
      }
      return;
    }

    // 살아있다면 명단에 추가
    playerRefs.current.push(event.target);
  };

  // 유튜브 플레이어 옵션
  const opts = {
    height: '240',
    width: '100%',
    playerVars: {
      autoplay: 0, // 자동 재생 끔 (에러 확률 감소)
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 rounded-2xl shadow-inner my-10 mb-4">
      <h2 className="text-3xl font-black text-gray-900 mb-6 border-l-8 border-blue-600 pl-4">
        오늘의 면접 추천 영상
      </h2>

      {/* 카테고리 탭 버튼 */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "primary" : "outline"}
            size="medium"
            onClick={() => setActiveCategory(cat)} 
          >
            {cat}
          </Button>
        ))}
      </div>
      
      {/* 영상 그리드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoList.length > 0 ? (
          videoList.map((video, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-md hover:-translate-y-2 transition-transform border border-gray-100">
              <div className="rounded-lg overflow-hidden shadow-sm">
                {/* 유튜브 컴포넌트에 안전장치 연결 */}
                <YouTube 
                  videoId={video.ytKey} 
                  opts={opts} 
                  onReady={onReady} 
                />
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