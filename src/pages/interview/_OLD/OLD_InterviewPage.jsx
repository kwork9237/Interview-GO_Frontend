import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const InterviewPage = () => {
    const { id } = useParams(); // URL의 UUID
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const scrollRef = useRef();
    const isStarted = useRef(false);

    // 메시지 추가 시 하단 자동 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 1. 페이지 로드 시 첫 질문 호출
    useEffect(() => {
        const startInterview = async () => {
            if (isStarted.current) return;
            isStarted.current = true;

            try {
                const response = await fetch(`http://localhost:8080/api/interview/start?sid=${id}`, {
                    method: 'POST'
                });
                const data = await response.json();
                setMessages([{ type: 'ai', text: data.text }]);
            } catch (error) {
                console.error("시작 에러:", error);
            }
        };
        if (id) startInterview();
    }, [id]);

    // 2. 답변 전송 핸들러
    const handleSend = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || loading || isFinished) return;

        const currentInput = userInput;
        setUserInput('');
        setLoading(true);

        // 유저 메시지 UI 추가
        setMessages(prev => [...prev, { type: 'user', text: currentInput }]);

        try {
            const response = await fetch(`http://localhost:8080/api/ai/local/chat?q=${encodeURIComponent(currentInput)}&sid=${id}`);
            const result = await response.json();
            const aiData = result.data; // 백엔드에서 파싱된 Map 객체

            setMessages(prev => [...prev, { 
                type: 'ai', 
                text: aiData.answer, 
                score: aiData.score, 
                feedback: aiData.feedback 
            }]);

            if (aiData.isLast) { 
                setIsFinished(true);
            }
            
        } catch (error) {
            console.error("답변 수신 에러:", error);

            // 에러가 났을 때 다시 시도하게 하고 싶다면 false로 돌려줌
            isStarted.current = false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col p-4">
            {/* Card 대신 직접 div를 사용하거나, Card를 쓰되 내부 패딩을 0으로 강제합니다.
                여기서는 겹침 현상을 막기 위해 직접 스타일을 잡는 것을 추천합니다.
            */}
            <div className="flex-1 bg-white border border-gray-200 rounded-3xl shadow-sm flex flex-col overflow-hidden mb-4">
                
                {/* 메시지 리스트 영역 */}
                <div 
                    ref={scrollRef} 
                    className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide"
                >
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] ${msg.type === 'ai' ? 'items-start' : 'items-end flex flex-col'}`}>
                                
                                {/* 말풍선: 텍스트가 길어져도 뱃지와 겹치지 않게 block 처리 */}
                                <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                                    msg.type === 'ai' 
                                    ? 'bg-gray-100 text-gray-800 rounded-tl-none' 
                                    : 'bg-primary text-white rounded-tr-none'
                                }`}>
                                    {msg.text}
                                </div>

                                {/* AI 분석 결과 (이 부분이 문제의 핵심이었습니다) */}
                                {msg.type === 'ai' && msg.score !== undefined && (
                                    <div className="mt-3 w-full bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 animate-fade-in">
                                        <div className="flex items-center gap-2 mb-2">
                                            {/* Badge 대신 순수 스타일로 그려서 공통 컴포넌트와의 충돌 방지 */}
                                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                                                AI Analysis
                                            </span>
                                            <span className="text-indigo-700 font-bold text-sm">
                                                Score: {msg.score}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-[13px] leading-snug">
                                            💡 {msg.feedback}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* 면접 종료 안내 UI */}
                    {isFinished && (
                        <div className="flex justify-center my-8 animate-bounce">
                            <div className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                                🏁 모든 면접 질문이 끝났습니다. 수고하셨습니다!
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-start">
                            <Spinner size="small" text="면접관이 생각 중..." />
                        </div>
                    )}
                </div>
            </div>

            {/* 입력바: 하단에 딱 붙도록 배치 */}
            <form onSubmit={handleSend} className="relative shrink-0">
                <input 
                    type="text" 
                    value={userInput} 
                    onChange={(e) => setUserInput(e.target.value)} 
                    // 종료되었거나 로딩 중일 때 placeholder 변경 및 비활성화
                    placeholder={
                        isFinished 
                        ? "면접이 종료되었습니다." 
                        : (loading ? "생각 중..." : "답변을 입력해 주세요.")
                    }
                    disabled={loading || isFinished}
                    className={`w-full p-4 pr-32 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none transition-all ${
                        isFinished ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-primary/20'
                    }`}
                />
                <div className="absolute right-2 top-2">
                    <Button 
                        type="submit" 
                        size="small" 
                        disabled={loading || !userInput.trim() || isFinished}
                        className="px-6 py-2"
                    >
                        {isFinished ? "종료됨" : "전송"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default InterviewPage;