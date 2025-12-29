// 테스트용 페이지입니다.
import React, { useState } from 'react';
import axios from 'axios';

const InterviewTestPage = () => {
    const [input, setInput] = useState('');     // 내가 입력한 텍스트
    const [result, setResult] = useState('');   // AI가 준 답변
    const [loading, setLoading] = useState(false);

    const handleTest = async () => {
        if (!input) return;
        setLoading(true);
        try {
            // Spring Boot의 테스트용 엔드포인트 호출
            const res = await axios.post('http://localhost:8080/chat-local', input, {
                headers: { 'Content-Type': 'text/plain' },
                params: { query : input }
            });
            setResult(res.data); // 결과 텍스트 저장
        } catch (error) {
            console.error("테스트 실패:", error);
            setResult("에러가 발생했습니다. 콘솔을 확인하세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gemma 텍스트 리턴 테스트</h1>
            <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="질문을 입력하세요"
                style={{ width: '300px', padding: '10px' }}
            />
            <button onClick={handleTest} style={{ padding: '10px 20px', marginLeft: '10px' }}>
                {loading ? '전송 중...' : '보내기'}
            </button>

            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc' }}>
                <strong>결과:</strong>
                <p>{result}</p>
            </div>
        </div>
    );
}

export default InterviewTestPage;