import { Children, cloneElement, isValidElement, type ReactNode } from 'react';

/** Keep real text and semantic markup while giving each word its own reveal mask. */
export function MotionText({ children }: { children: ReactNode }) {
  const words = (nodes: ReactNode): ReactNode => Children.map(nodes, (child, index) => {
    if (typeof child === 'string') {
      return child.split(/(\s+)/).map((word, wordIndex) => /^\s+$/.test(word) ? word :
        <span className="motion-word" key={`${index}-${wordIndex}`}><span className="motion-word-inner">{word}</span></span>);
    }
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) {
      return cloneElement(child, { children: words(child.props.children) });
    }
    return child;
  });
  return <>{words(children)}</>;
}

export function HeroLetters({ text }: { text: string }) {
  return <>{Array.from(text).map((letter, index) => <span className="motion-letter" key={index}>{letter}</span>)}</>;
}
