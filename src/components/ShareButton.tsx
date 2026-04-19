"use client"
import { Button } from "./ui/button";
import { useState } from "react";

interface ShareButtonProps {
  title: string; // Title of the content to share
  text: string; // Main text/content to share
  url?: string; // URL to share, optional
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
    const [resultMessage, setResultMessage] = useState("");

  const shareData = {
    title,
    text,
    url,
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setResultMessage('感謝你的分享');
      } catch (err) {
        const { name } = err as Error;
        if (name === 'AbortError') {
          setResultMessage('您已取消分享此訊息');
        } else {
          console.error('發生錯誤', err);
          setResultMessage('分享失敗');
        }
      }
    } else {
      handleCopyToClipboard(`我做了${title}，結果是${text}。`);
    }
  };

  const handleCopyToClipboard = (textToCopy: string | undefined) => {
    if (!textToCopy) {
        console.error('No URL to copy');
        setResultMessage('無URL可複製');
        return;
      }
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          alert(`${textToCopy} - 複製成功`);
          setResultMessage('URL已複製到剪貼簿');
        },
        (err) => {
          console.error('無法複製', err);
          setResultMessage('複製失敗');
        }
      );
  };

  return (
    <div>
      <Button
        variant="link"
        onClick={() => window.open("https://lin.ee/4iRHvdC", "_blank")}
      >
        文心樂丞官方帳號
      </Button>
      <Button onClick={handleShare}>分享結果</Button>
      {resultMessage && <p className="result">{resultMessage}</p>}
    </div>
  );
};

export default ShareButton;
