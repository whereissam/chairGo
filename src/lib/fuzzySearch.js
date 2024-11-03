// Simple fuzzy search implementation
export function fuzzySearch(searchStr, targetStr) {
  // Handle null or undefined inputs
  if (!searchStr || !targetStr) return 0;
  
  const search = searchStr.toLowerCase().trim();
  const target = targetStr.toLowerCase().trim();
  
  // Direct match gets highest score
  if (target.includes(search)) return 2;
  
  // Split both search and target into words
  const searchWords = search.split(/\s+/);
  const targetWords = target.split(/\s+/);
  
  let totalScore = 0;
  
  for (const searchWord of searchWords) {
    let wordScore = 0;
    
    // Check each target word for partial matches
    for (const targetWord of targetWords) {
      // If target word starts with search word
      if (targetWord.startsWith(searchWord)) {
        wordScore = Math.max(wordScore, 1.5);
        continue;
      }
      // If target word contains search word
      if (targetWord.includes(searchWord)) {
        wordScore = Math.max(wordScore, 1);
        continue;
      }
      // If search word is at least 2 characters and matches start of target word
      if (searchWord.length >= 2 && targetWord.startsWith(searchWord)) {
        wordScore = Math.max(wordScore, 1);
        continue;
      }
    }
    
    totalScore += wordScore;
  }
  
  // Return average score across all search words
  return totalScore / searchWords.length;
} 