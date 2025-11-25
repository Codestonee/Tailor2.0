from typing import Dict, List

class SkillExtractor:
    """Extract och kategorize skills från CV och job descriptions"""
    
    HARD_SKILLS = {
        'languages': ['python', 'javascript', 'java', 'c++', 'csharp', 'ruby', 'go', 'rust'],
        'frameworks': ['react', 'vue', 'angular', 'django', 'flask', 'fastapi', 'nodejs'],
        'databases': ['sql', 'postgresql', 'mongodb', 'firebase', 'dynamodb'],
        'tools': ['git', 'docker', 'kubernetes', 'jenkins', 'aws', 'gcp', 'azure'],
        'data': ['machine learning', 'data analysis', 'bi', 'analytics'],
    }
    
    SOFT_SKILLS = [
        'communication', 'teamwork', 'leadership', 'problem-solving',
        'creativity', 'time management', 'adaptability', 'critical thinking'
    ]
    
    @staticmethod
    def extract_from_text(text: str) -> Dict[str, List[str]]:
        """Extract all skill types from text"""
        text_lower = text.lower()
        
        hard_skills = []
        soft_skills = []
        
        # Hard skills
        for category, skills in SkillExtractor.HARD_SKILLS.items():
            for skill in skills:
                if skill in text_lower:
                    hard_skills.append(skill)
        
        # Soft skills
        for skill in SkillExtractor.SOFT_SKILLS:
            if skill in text_lower:
                soft_skills.append(skill)
        
        return {
            'hard_skills': list(set(hard_skills)),
            'soft_skills': list(set(soft_skills))
        }
    
    @staticmethod
    def calculate_skill_match(cv_skills: List[str], job_skills: List[str]) -> Dict:
        """Calculate skill matching"""
        cv_set = set(s.lower() for s in cv_skills)
        job_set = set(s.lower() for s in job_skills)
        
        matched = cv_set & job_set
        missing = job_set - cv_set
        
        match_percentage = len(matched) / len(job_set) * 100 if job_set else 0
        
        return {
            'matched': list(matched),
            'missing': list(missing),
            'percentage': min(100, int(match_percentage))
        }