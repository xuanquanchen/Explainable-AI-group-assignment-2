export const humanAISuggestions = [
    "So what do you consider as an [heart]?",
    "As a photographer and [musician], I consider this as a form of art.",
    "Like you know, paintings, crafts, [cultures] a lot of things, what about you?",
    "When you have the [tine], do it, because it's—you know, it's.",
    "You know you know I before watched the [Star] Wars, have a part in there…",
    "Ah, yeah. The black [peach]. Yeah, yeah. It's also, yeah, call there's.",
    "All those who were not wearing a tie were [refused] admission to the club.",
    "The final [episode] will be shown next Sunday.",
    "To get a nice image of her facial [gesture].",
  ];

  export const humanAIWordAlternatives: Array<Record<string, string[]>> = [
    // art ↔ heart / cart / part
    { heart: ["heart", "cart", "part"] },
  
    // musician ↔ magician / musician / mutician
    { musician: ["musician", "magician", "mutician"] },
  
    // cultures ↔ sculptures / cutters / cultures
    { cultures: ["cultures", "sculptures", "cutters"] },
  
    // time ↔ thyme / tine / time
    { tine: ["thyme", "tine"] },
  
    // Star Wars ↔ star wars / storehouse / Starr Waters
    { Star: ["Star", "store", "Starr", "stur"] },
  
    // beach ↔ peach / preach / beach
    { peach: ["peach", "preach"] },
  
    // refused ↔ reviewed / defused / refused
    { refused: ["refused", "reviewed", "defused"] },
  
    // episode ↔ episodic / upside / episode
    { episode: ["episode", "episodic", "upside"] },
  
    // texture ↔ lecture / gesture / texture
    { gesture: ["lecture", "gesture"] },
  ];