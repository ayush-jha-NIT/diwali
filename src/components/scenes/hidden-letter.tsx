"use client";

import { useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import type { SceneProps } from "@/components/experience/experience";

export function HiddenLetter({ onNext, playChime }: SceneProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="scene letter-scene">
      <div className="scene-heading">
        <span className="eyebrow">CHAPTER FOUR · THE HIDDEN LETTER</span>
        <h1>A note, <em>just for you.</em></h1>
        <p>Kuch baatein postcards mein nahi, sirf dil mein hoti hain.</p>
      </div>
      {!open ? (
        <button type="button" className="envelope" onClick={() => { setOpen(true); playChime(840); }} aria-label="Open the letter">
          <span className="envelope__back" />
          <span className="envelope__flap" />
          <span className="envelope__seal"><Heart size={20} fill="currentColor" /></span>
          <span className="envelope__caption">TAP TO UNSEAL</span>
        </button>
      ) : (
        <div className="letter-paper">
          <span className="letter-paper__top">A LITTLE NOTE FROM THE HEART</span>
          <p>Diwali pe har jagah lights lagti hain, but kuch log bina kisi light ke bhi din bright kar dete hain.</p>
          <p>Tum unhi special logon mein se ho.</p>
          <p>Bas ek chhoti si wish: tumhari smile kabhi kam na ho, aur har naya din tumhare liye kuch beautiful lekar aaye.</p>
          <p>Waise... ek last surprise abhi baaki hai.</p>
          <span className="letter-paper__signature">With a little magic,<br /><strong>Ayush</strong></span>
          <button className="gold-button" type="button" onClick={onNext}>
            There&apos;s one more thing <ArrowRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
