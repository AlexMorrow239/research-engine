import { type FC, useEffect, useState } from "react";

import "./KonamiCode.scss";

const KONAMI_CODE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

const messages = [
  "HELP ME",
  "IM TRAPPED IN THE BASEMENT",
  "I HAVENT EATEN IN DAYS",
];

export const KonamiCode: FC = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (!event.key) return; // Guard clause to prevent undefined key

      const key = event.key.toLowerCase();
      const newSequence = [...sequence, key];

      // Keep only the last N keys where N is the length of the Konami code
      if (newSequence.length > KONAMI_CODE.length) {
        newSequence.shift();
      }

      setSequence(newSequence);

      // Check if the sequence matches the Konami code
      const match = KONAMI_CODE.every(
        (code, index) => code.toLowerCase() === newSequence[index]
      );

      if (match) {
        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
        setMessage(randomMessage);
        setShowEasterEgg(true);
        setTimeout(() => setShowEasterEgg(false), 3000);
        setSequence([]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [sequence]);

  if (!showEasterEgg) return null;

  return (
    <div className="konami-overlay">
      <div className="konami-message">{message}</div>
    </div>
  );
};
