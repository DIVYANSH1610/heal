import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Botpress is loaded
    const checkBotpress = () => {
      if (window.botpressWebChat) {
        setIsLoaded(true);
      } else {
        setTimeout(checkBotpress, 100);
      }
    };
    checkBotpress();
  }, []);

  const toggleChat = () => {
    if (!isLoaded) return;
    
    if (isOpen) {
      window.botpressWebChat.sendEvent({ type: "hide" });
    } else {
      window.botpressWebChat.sendEvent({ type: "show" });
    }
    setIsOpen(!isOpen);
  };

  if (!isLoaded) {
    return null; // Don't render until Botpress is loaded
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleChat}
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </Button>
    </div>
  );
};

export default ChatBot;