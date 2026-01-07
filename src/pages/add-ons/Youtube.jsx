import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import Button from '../../components/common/Button';

// 개별 비디오 아이템 컴포넌트 (내부에서 로컬 상태로 재생 여부 관리)
const VideoItem = ({ video, opts }) => {
  const [isPlay, setIsPlay] = useState(false);

  // 카테고리가 바뀌어 video 데이터가 변경되면 다시 썸네일 모드로 리셋
  useEffect(() => {
    setIsPlay(false);
  }, [video.ytKey]);

  if (isPlay) {
    return (
      <YouTube 
        videoId={video.ytKey} 
        opts={{ ...opts, playerVars: { ...opts.playerVars, autoplay: 1 } }} 
      />
    );
  }

  return (
    <div 
      className="relative cursor-pointer group" 
      onClick={() => setIsPlay(true)}
    >
      {/* 유튜브 고화질 썸네일 이미지 */}
      <img 
        src={`https://img.youtube.com/vi/${video.ytKey}/mqdefault.jpg`} 
        alt="thumbnail"
        className="w-full h-[240px] object-cover rounded-lg"
      />
      {/* 재생 버튼 아이콘 오버레이 */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
        </div>
      </div>
    </div>
  );
};

const YoutubeSection = () => {
  const [videoList, setVideoList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("면접 꿀팁");
  const categories = ["면접 꿀팁", "개발자 기술면접", "자기소개서 작성법"];
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    axios.get(`http://localhost:8080/api/youtube/check`, { params: { category: activeCategory } })
      .then(response => {
        if (isMounted.current) setVideoList(response.data);
      })
      .catch(error => console.error("데이터 호출 실패:", error));

    return () => { isMounted.current = false; };
  }, [activeCategory]);

  const opts = {
    height: '240',
    width: '100%',
    playerVars: { autoplay: 0 },
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 rounded-2xl my-10">
      <h2 className="text-3xl font-black mb-6 border-l-8 border-blue-600 pl-4">오늘의 추천 영상</h2>
      
      <div className="flex gap-3 mb-8">
        {categories.map((cat) => (
          <Button key={cat} variant={activeCategory === cat ? "primary" : "outline"} onClick={() => setActiveCategory(cat)}>
            {cat}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoList.map((video) => (
          <div key={video.ytKey} className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="rounded-lg overflow-hidden">
              {/* 핵심: 컴포넌트를 분리하여 개별적으로 로드 제어 */}
              <VideoItem video={video} opts={opts} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YoutubeSection;