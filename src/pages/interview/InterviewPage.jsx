import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import InterviewSidebar from '../../components/layout/InterviewSidebar'; // 사이드바 가져오기

const InterviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // 1. 기존 면접 로직 상태
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    
    // 2. 사이드바 연동을 위한 상태 (추가)
    // 질문이 하나 올 때마다 단계를 올리기 위해 messages.filter(m => m.type === 'ai').length 사용 가능
    const [totalStep] = useState(4);
    const isStarted = useRef(false);
    const scrollRef = useRef();

    // 현재 단계를 AI 메시지 개수로 계산
    const currentStep = Math.min(totalStep, messages.filter(m => m.type === 'ai').length);

    // 자동 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 초기 질문 시작
    useEffect(() => {
    const loadHistoryOrStart = async () => {
        if (isStarted.current) return;
        isStarted.current = true;

        try {
            // 1. 기존 내역 조회 (GET)
            const historyRes = await fetch(`http://localhost:8080/api/interview/history?sid=${id}`);
            console.log(historyRes.status);
            // 1. 서버 응답 자체가 에러인 경우 (404, 500 등)
            if (!historyRes.ok) {
                alert("유효하지 않은 면접 세션입니다.");
                navigate('/');
                return;
            }

            const historyResult = await historyRes.json();
            const historyList = historyResult.data; // 백엔드에서 보낸 List<InterviewHistoryDTO>

            // 2. 데이터 구조가 잘못되었거나 sid 자체가 DB에 없는 경우
            // (보통 백엔드에서 데이터가 없으면 null을 주거나 result.data가 undefined일 수 있음)
            if (!historyResult || historyList === null) {
                alert("면접 정보를 찾을 수 없습니다.");
                navigate('/');
                return;
            }

            // 2. 내역이 있는지 확인 (리스트가 비어있지 않은지)
            if (historyList && historyList.length > 0) {
                const loadedMessages = [];
                
                historyList.forEach(item => {
                    // step 번호에 따라 type을 결정합니다.
                    // 예: step 1, 3, 5... 는 AI / step 2, 4, 6... 은 유저
                    const isAi = item.iv_step % 2 !== 0; 

                    loadedMessages.push({
                        type: isAi ? 'ai' : 'user',
                        text: item.iv_context, // DTO에서 실제 텍스트가 담긴 필드명으로 수정 (예: item.content)
                        score: (isAi && item.iv_score > 0) ? item.iv_score : undefined,
                        feedback: (isAi && item.iv_feedback) ? item.iv_feedback : undefined
                    });
                });

                setMessages(loadedMessages);
                
                // 마지막 데이터 기준으로 종료 여부 판단
                const lastStep = historyList[historyList.length - 1].iv_step;
                if (lastStep >= 7) {
                    setIsFinished(true); // 여기서 true가 되어야 전송 버튼이 막힘
                }

            } else {
                // 3. 내역이 없으면 처음 시작 API 호출
                const startRes = await fetch(`http://localhost:8080/api/interview/start?sid=${id}`, { method: 'POST' });
                const startData = await startRes.json();
                setMessages([{ type: 'ai', text: startData.text }]);
            }
        } catch (error) {
            console.error("데이터 로딩 에러:", error);
        }};

        if (id) loadHistoryOrStart();
    }, [id, navigate]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || loading || isFinished) return;

        const currentInput = userInput;
        setUserInput('');
        setLoading(true);
        setMessages(prev => [...prev, { type: 'user', text: currentInput }]);

        try {
            // 로컬모드 : http://localhost:8080/api/ai/local/chat
            // 서버모드 : http://localhost:8080/api/ai/server/chat
            const response = await fetch(`http://localhost:8080/api/ai/local/chat?q=${encodeURIComponent(currentInput)}&sid=${id}`);
            const result = await response.json();
            const aiData = result.data;

            setMessages(prev => [...prev, { 
                type: 'ai', 
                text: aiData.answer, 
                score: aiData.score, 
                feedback: aiData.feedback 
            }]);

            if (aiData.isLast) setIsFinished(true);
        } catch (error) {
            console.error("답변 수신 에러:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 상단 헤더 */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-40 sticky top-0">
                <h1 className="text-lg font-bold text-gray-800">AI 실전 면접실</h1>
                <Button size="small" variant="outline" onClick={() => navigate('/')}>나가기</Button>
            </header>

            {/* 메인 레이아웃: 사이드바 + 면접창 */}
            <div className="flex max-w-7xl mx-auto w-full gap-8 p-6 items-start flex-1">
                
                {/* 1. 왼쪽 사이드바 (실제 상태 연동) */}
                <InterviewSidebar 
                    currentStep={currentStep}
                    totalStep={totalStep}
                    isVoiceMode={false} // 필요시 상태로 관리
                    timerActive={!isFinished && isStarted.current} // 면접 중일 때만 타이머 작동
                />

                {/* 2. 오른쪽 면접 대화창 */}
                <main className="flex-1 flex flex-col h-[calc(100vh-160px)]">
                    <div className="flex-1 bg-white border border-gray-200 rounded-3xl shadow-sm flex flex-col overflow-hidden mb-4">
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[85%] ${msg.type === 'ai' ? 'items-start' : 'items-end flex flex-col'}`}>
                                        <div className={`p-4 rounded-2xl text-[15px] shadow-sm ${
                                            msg.type === 'ai' ? 'bg-gray-100 text-gray-800 rounded-tl-none' : 'bg-primary text-white rounded-tr-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        {msg.type === 'ai' && msg.score !== undefined && (
                                            <div className="mt-3 w-full bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 animate-fade-in text-[13px]">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded">AI 분석</span>
                                                    <span className="text-indigo-700 font-bold">Score: {msg.score}</span>
                                                </div>
                                                <p className="text-gray-600 leading-snug">💡 {msg.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* 종료 안내 및 이동 버튼 */}
                            {isFinished && (
                                <div className="flex flex-col items-center gap-4 py-10 animate-fade-in">
                                    <div className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm">
                                        🏁 면접이 종료되었습니다.
                                    </div>
                                    <Button onClick={() => navigate('/')} className="px-10">메인으로 돌아가기</Button>
                                </div>
                            )}

                            {loading && (
                                <div className="flex justify-start">
                                    <Spinner size="small" text="면접관이 다음 질문을 준비 중입니다..." />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 입력창 */}
                    <form onSubmit={handleSend} className="relative shrink-0">
                        <input 
                            type="text" 
                            value={userInput} 
                            onChange={(e) => setUserInput(e.target.value)} 
                            placeholder={isFinished ? "면접이 종료되었습니다." : "답변을 입력해 주세요."}
                            disabled={loading || isFinished}
                            className={`w-full p-4 pr-32 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none transition-all ${
                                isFinished ? 'bg-gray-50 opacity-50' : 'focus:ring-2 focus:ring-primary/20'
                            }`}
                        />
                        <div className="absolute right-2 top-2">
                            <Button type="submit" size="small" disabled={loading || !userInput.trim() || isFinished}>
                                {isFinished ? "종료" : "전송"}
                            </Button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default InterviewPage;