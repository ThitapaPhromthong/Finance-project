import React, { useState, useEffect } from 'react';
import { Input, Typography } from 'antd';

const GoalsBox = ({ summaryAmount }) => {
  const [goal, setGoal] = useState(0); 
  const [progress, setProgress] = useState(0); 

  const handleSetGoal = (newGoal) => {
    setGoal(newGoal);
    calculateProgress(summaryAmount, newGoal);
  };

  const calculateProgress = (currentAmount, goalAmount) => {
    const progressPercentage = Math.min((currentAmount / goalAmount) * 100, 100); 
    setProgress(progressPercentage);
  };

  useEffect(() => {
    if (goal > 0) {
      calculateProgress(summaryAmount, goal);
    }
  }, [summaryAmount, goal]);

  return (
    <div style={{ width: '400px', margin: '20px auto', textAlign: 'center' }}>
      <Typography.Title level={4}>ตั้งเป้าหมาย</Typography.Title>
      <Input
        type="number"
        placeholder="ระบุจำนวนเป้าหมาย (บาท)"
        onChange={(e) => handleSetGoal(Number(e.target.value))}
        style={{ marginBottom: '10px' }}
      />
      <div style={{
        height: '30px',
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: '15px',
        overflow: 'hidden',
        marginBottom: '10px',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#28a745',
          textAlign: 'center',
          lineHeight: '30px',
          color: 'white',
          borderRadius: '15px',
        }}>
          {progress.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default GoalsBox;
