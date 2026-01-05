import React, { useState, useEffect } from 'react';
import { TagCloud } from 'react-tagcloud'; // 설치한 태그클라우드 라이브러리 임포트
import axios from 'axios';

const WordCloud = () => {
    // 상태 관리: words(단어 데이터 리스트), loading(로딩 여부)
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);

    // [디자인] 태그들의 색상을 결정하는 옵션 (밝은 파란색 계열)
    const colorOptions = {
        luminosity: 'bright',
        hue: 'blue',
    };

    useEffect(() => {
        setLoading(true); // 데이터 호출 전 로딩 시작
        axios.get('http://localhost:8080/api/wordcloud/list') // 백엔드 API 호출
            .then(res => {
                // 백엔드 데이터(word, count)를 라이브러리 규격(value, count)에 맞게 변환
                const formattedData = res.data.map(item => ({
                    value: item.word, // 화면에 표시될 단어
                    count: item.count  // 단어의 빈도수 (크기 결정)
                }));
                setWords(formattedData); // 가공된 데이터 저장
                setLoading(false); // 로딩 종료
            })
            .catch(err => {
                console.error("데이터 로드 에러:", err);
                setLoading(false);
            });
    }, []);

    // 데이터를 불러오는 중일 때 보여줄 화면
    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중... ☁️</div>;

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '30px' 
        }}>
            {/* 구름 모양 컨테이너 */}
            <div style={{ 
                width: '100%',
                maxWidth: '850px', 
                height: '480px',    
                padding: '50px 40px',
                // 배경 그라데이션: 중앙은 흰색, 외곽은 연한 파란색
                background: 'radial-gradient(circle, #ffffff 0%, #e6f7ff 100%)', 
                //비정형 원형 수치를 주어 몽글몽글한 구름 모양 구현
                borderRadius: '60% 40% 70% 30% / 40% 60% 40% 60%', 
                boxShadow: '0 15px 45px rgba(0,0,0,0.06)', // 은은한 그림자
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <h2 style={{ 
                    color: '#0050b3', 
                    marginBottom: '30px', 
                    fontSize: '1.6rem',
                    fontWeight: '800'
                }}>
                    실시간 취업 관련 키워드
                </h2>
                
                {/* 실제 단어 구름 컴포넌트 */}
                <TagCloud
                    minSize={18}   // 가장 작은 단어의 폰트 크기
                    maxSize={65}   // 가장 큰 단어의 폰트 크기
                    tags={words}   // 위에서 가공한 데이터 주입
                    colorOptions={colorOptions}
                    style={{ 
                        fontFamily: 'Pretendard, sans-serif',
                        fontWeight: 'bold',
                        lineHeight: '1.6', // 단어 간 세로 간격 조절
                        padding: '10px'
                    }}
                    onClick={tag => console.log(`${tag.value} 클릭됨`)} // 클릭 이벤트
                />
            </div>
        </div>
    );
};

export default WordCloud;