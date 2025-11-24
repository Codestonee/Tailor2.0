import re
import unicodedata
from typing import List, Set

class TextNormalizer:
    """Normalize och clean text för matching"""
    
    # Skill synonyms mapping
    SKILL_SYNONYMS = {
        'react.js': 'react',
        'javascript': 'js',
        'typescript': 'ts',
        'node.js': 'nodejs',
        'node': 'nodejs',
        'python3': 'python',
        'C#': 'csharp',
        'C++': 'cpp',
        'machine learning': 'ml',
        'artificial intelligence': 'ai',
        'data science': 'datascience',
        'sql': 'database',
        'postgresql': 'postgres',
        'communication': 'teamwork',
        'problem-solving': 'problemsolving',
        'sjukskötare': 'nurse',
        'sjuksköterska': 'nurse',
    }
    
    REMOVE_WORDS = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
        'detta', 'den', 'ett', 'en', 'och', 'eller', 'men', 'i', 'på', 'till',
        'för', 'med', 'av', 'från', 'om', 'under',
    }
    
    @staticmethod
    def normalize(text: str) -> str:
        """Normalize text för matching"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove accents
        text = ''.join(
            c for c in unicodedata.normalize('NFD', text)
            if unicodedata.category(c) != 'Mn'
        )
        
        # Remove special characters, keep spaces and hyphens
        text = re.sub(r'[^a-z0-9\s\-_]', '', text)
        
        # Replace multiple spaces with single
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
    
    @staticmethod
    def normalize_skill(skill: str) -> str:
        """Normalize single skill with synonym mapping"""
        normalized = TextNormalizer.normalize(skill)
        return TextNormalizer.SKILL_SYNONYMS.get(normalized, normalized)
    
    @staticmethod
    def extract_words(text: str) -> Set[str]:
        """Extract meaningful words from text"""
        normalized = TextNormalizer.normalize(text)
        words = set(normalized.split())
        return words - TextNormalizer.REMOVE_WORDS