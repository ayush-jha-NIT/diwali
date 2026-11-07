export const experience = {
  title: "The Last Spark",
  recipient: "KUHU",
  sender: "Ayush",
  language: "hinglish",
  tone: "playful-romantic",
  scenes: [
    { id: "invitation", title: "The Secret Invitation", subtitle: "A little magic is waiting" },
    { id: "lost-diyas", title: "The Lost Diyas", subtitle: "Collect the little lights" },
    { id: "rangoli", title: "The Enchanted Rangoli", subtitle: "Find the missing colors" },
    { id: "wishing-stars", title: "The Wishing Stars", subtitle: "Connect the impossible" },
    { id: "hidden-letter", title: "The Hidden Letter", subtitle: "A note from the heart" },
    { id: "skyshot-launch", title: "The Final Spark", subtitle: "Send a wish to the sky" },
    { id: "grand-finale", title: "The Sky Belongs to You", subtitle: "The last surprise" },
  ],
  palette: {
    midnight: "#090b20",
    amethyst: "#30134e",
    gold: "#f4c46e",
    rose: "#e996c8",
    starlight: "#8dd9ea",
  },
} as const;

export type SceneId = (typeof experience.scenes)[number]["id"];
