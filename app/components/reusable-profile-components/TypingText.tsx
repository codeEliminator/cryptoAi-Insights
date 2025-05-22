import React, { useEffect, useState, useRef } from 'react';
import { Text, Animated } from 'react-native';

interface TypingTextProps {
  textArray: string[];
  style?: any;
  typingSpeed?: number;
  delayBetweenTexts?: number;
  delayBeforeErasing?: number;
}

const TypingText = ({ textArray, style, typingSpeed = 50, delayBetweenTexts = 1000, delayBeforeErasing = 2000 }: TypingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTyping) {
      if (displayedText.length < textArray[currentIndex].length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(textArray[currentIndex].substring(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, delayBeforeErasing);
      }
    } else {
      if (displayedText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1));
        }, typingSpeed / 2); 
      } else {
        const nextIndex = (currentIndex + 1) % textArray.length;
        setCurrentIndex(nextIndex);
        setIsTyping(true);
        timeoutRef.current = setTimeout(() => {}, delayBetweenTexts);
      }
    }
  }, [displayedText, isTyping, currentIndex, textArray, typingSpeed, delayBetweenTexts, delayBeforeErasing]);

  return <Text style={style}>{displayedText}<Animated.Text style={style}>|</Animated.Text></Text>;
};

export default TypingText;
