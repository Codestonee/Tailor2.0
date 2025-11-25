from app.utils.text_normalizer import TextNormalizer
from app.utils.skill_extractor import SkillExtractor
from app.services.embedding_service import EmbeddingService
from typing import Dict

class MatchingService:
    """★ CORE MATCHING ENGINE ★"""
    
    def __init__(self):
        self.normalizer = TextNormalizer()
        self.skill_extractor = SkillExtractor()
        self.embedding_service = EmbeddingService()
    
    def match_cv_to_job(self, cv_text: str, job_text: str) -> Dict:
        """
        Comprehensive CV-to-job matching with multiple scoring methods.
        Returns scores for: skills, experience, semantic fit, overall.
        """
        
        # Extract normalized content
        cv_normalized = self.normalizer.normalize(cv_text)
        job_normalized = self.normalizer.normalize(job_text)
        
        # 1. SKILL MATCHING (30% weight)
        cv_skills = self.skill_extractor.extract_from_text(cv_text)
        job_skills = self.skill_extractor.extract_from_text(job_text)
        
        skill_match = SkillExtractor.calculate_skill_match(
            cv_skills['hard_skills'],
            job_skills['hard_skills']
        )
        skill_score = skill_match['percentage']
        
        # 2. KEYWORD MATCHING (25% weight)
        cv_words = self.normalizer.extract_words(cv_normalized)
        job_words = self.normalizer.extract_words(job_normalized)
        keyword_overlap = len(cv_words & job_words) / len(job_words) * 100 if job_words else 0
        
        # 3. SEMANTIC SIMILARITY (25% weight)
        semantic_score = self.embedding_service.similarity(cv_text, job_text) * 100
        
        # 4. EXPERIENCE INDICATORS (20% weight)
        years_match = self._estimate_experience_match(cv_text, job_text)
        
        # COMBINED SCORE
        overall_score = int(
            skill_score * 0.30 +
            keyword_overlap * 0.25 +
            semantic_score * 0.25 +
            years_match * 0.20
        )
        
        return {
            'overall_score': min(100, overall_score),
            'skill_score': int(skill_score),
            'keyword_score': int(keyword_overlap),
            'semantic_score': int(semantic_score),
            'experience_score': int(years_match),
            'matched_skills': skill_match['matched'],
            'missing_skills': skill_match['missing'],
            'recommendations': self._generate_recommendations(skill_match, cv_text)
        }
    
    def _estimate_experience_match(self, cv_text: str, job_text: str) -> float:
        """Estimate if CV experience matches job seniority"""
        import re
        
        # Look for experience indicators
        cv_years = re.findall(r'(\d+)\s*(?:years?|år)', cv_text, re.IGNORECASE)
        job_years = re.findall(r'(\d+)\s*(?:years?|år)', job_text, re.IGNORECASE)
        
        if not cv_years or not job_years:
            return 50.0  # Neutral if unclear
        
        try:
            cv_total = sum(int(y) for y in cv_years) / len(cv_years)
            job_required = int(job_years[0])
        except:
             return 50.0
        
        # If CV has equal or more years than required: high score
        if cv_total >= job_required * 0.8:
            return 85.0
        elif cv_total >= job_required * 0.5:
            return 65.0
        else:
            return 40.0
    
    def _generate_recommendations(self, skill_match: Dict, cv_text: str) -> list:
        """Generate improvement recommendations"""
        recommendations = []
        
        if skill_match['missing']:
            recommendations.append(
                f"Lägg till erfarenhet av: {', '.join(skill_match['missing'][:3])}"
            )
        
        if 'years' not in cv_text.lower() and 'år' not in cv_text.lower():
            recommendations.append("Förtydliga din arbetslivserfarenhet och antal år")
        
        if len(cv_text) < 500:
            recommendations.append("Utöka din CV-beskrivning med mer detaljer om dina projekt")
        
        return recommendations