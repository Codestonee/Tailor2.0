from typing import List
import numpy as np

try:
    from sentence_transformers import SentenceTransformer, util
    EMBEDDINGS_AVAILABLE = True
except ImportError:
    EMBEDDINGS_AVAILABLE = False

class EmbeddingService:
    """Embeddings-based semantic similarity"""
    
    def __init__(self):
        self.available = EMBEDDINGS_AVAILABLE
        if EMBEDDINGS_AVAILABLE:
            # Using a lightweight model for speed
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        else:
            self.model = None
    
    def similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts (0-1)"""
        if not self.available:
            return 0.0
        
        try:
            emb1 = self.model.encode(text1, convert_to_tensor=True)
            emb2 = self.model.encode(text2, convert_to_tensor=True)
            similarity = util.pytorch_cos_sim(emb1, emb2).item()
            return min(1.0, max(0.0, similarity))
        except Exception as e:
            print(f"Similarity error: {e}")
            return 0.0