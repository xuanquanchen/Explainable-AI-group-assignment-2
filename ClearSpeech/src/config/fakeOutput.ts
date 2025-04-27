export const humanAISuggestions = [
    "So what do you consider as an [art]?",
    "As a photographer and [musician], I consider this as a form of art.",
    "Like you know, paintings, crafts, [cultures] a lot of things, what about you?",
    "When you have the [time], do it, because it's—you know, it's.",
    "You know you know I before watched the [Star Wars], have a part in there…",
    "Ah, yeah. The black [beach]. Yeah, yeah. It's also, yeah, call there's.",
    "All those who were not wearing a tie were [refused] admission to the club.",
    "The final [episode] will be shown next Sunday.",
    "To get a nice image of her facial [texture].",
  ];

  export const humanAIWordAlternatives: Array<Record<string, string[]>> = [
    // art ↔ heart / cart / part
    { art: ["art", "heart", "cart", "part"] },
  
    // musician ↔ magician / musician / mutician(伪)
    { musician: ["musician", "magician", "mutician", "musician"] },
  
    // cultures ↔ sculptures / cutters / cultures
    { cultures: ["cultures", "sculptures", "cutters", "cultures"] },
  
    // time ↔ thyme / tine / time
    { time: ["time", "thyme", "tine", "time"] },
  
    // Star Wars ↔ star wars / storehouse / Starr Waters
    { "Star Wars": ["Star Wars", "star wars", "storehouse", "Starr Waters"] },
  
    // beach ↔ peach / preach / beach
    { beach: ["beach", "peach", "preach", "beach"] },
  
    // refused ↔ reviewed / defused / refused
    { refused: ["refused", "reviewed", "defused", "refused"] },
  
    // episode ↔ episodic / upside / episode
    { episode: ["episode", "episodic", "upside", "episode"] },
  
    // texture ↔ lecture / gesture / texture
    { texture: ["texture", "lecture", "gesture", "texture"] },
  ];

  export const onlyAICandidates = [
    // 真实句直接从 transcriptPaths fetch 得到，不必再硬编码
    
    // 这里依然提供几个辅助示例
    "Art is the mirror of human experience in every frame.",
    "A photograph captures the essence of a fleeting moment.",
    "Music and painting both speak in silent languages of emotion."
  ];