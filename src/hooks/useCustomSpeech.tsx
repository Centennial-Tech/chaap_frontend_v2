// import { useMemo } from "react";
import { useSpeech } from "react-text-to-speech";

// const getRandomPrefix = () => {
//   const prefixes = ["Hmm.", "Alright.", "Okay.", "Well.", "Sure.", "You know."];
//   return prefixes[Math.floor(Math.random() * prefixes.length)];
// };

const useCustomSpeech = ({ content }: { content: string }) => {
  //   const friendlyText = useMemo(
  //     () => `${getRandomPrefix()} ${content}`,
  //     [content]
  //   );
  return useSpeech({
    text: content,
    pitch: 1.2, // Slightly higher pitch for friendliness
    rate: 0.92, // Slightly slower rate for clarity
    volume: 1, // Full volume
    lang: "en-US", // American English
  });
};

export default useCustomSpeech;
