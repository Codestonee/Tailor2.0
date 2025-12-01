export interface JobSearchParams {
  query?: string;
  location?: string;
  radius?: number;
  limit?: number;
}

export interface JobPosting {
  id: string;
  title: string;
  employer: string;
  description: string;
  location: string;
  url: string;
  published: string;
}

// Arbetsförmedlingen API
const AF_API_BASE = 'https://jobsearch.api.jobtechdev.se';

export async function searchJobs(params: JobSearchParams): Promise<JobPosting[]> {
  const url = new URL(`${AF_API_BASE}/search`);
  
  // Build query parameters
  if (params.query) url.searchParams.append('q', params.query);
  if (params.location) url.searchParams.append('place', params.location);
  if (params.radius) url.searchParams.append('radius', params.radius.toString());
  url.searchParams.append('limit', (params.limit || 10).toString());
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.hits.map((hit: any) => ({
      id: hit.id,
      title: hit.headline,
      employer: hit.employer?.name || 'Okänd arbetsgivare',
      description: hit.description?.text || '',
      location: hit.workplace_address?.municipality || params.location || '',
      url: hit.webpage_url || `https://arbetsformedlingen.se/platsbanken/annonser/${hit.id}`,
      published: hit.publication_date
    }));
  } catch (error) {
    console.error('Job search failed:', error);
    return [];
  }
}

export async function getJobById(jobId: string): Promise<JobPosting | null> {
  try {
    const response = await fetch(`${AF_API_BASE}/ad/${jobId}`);
    if (!response.ok) return null;
    
    const hit = await response.json();
    return {
      id: hit.id,
      title: hit.headline,
      employer: hit.employer?.name || 'Okänd arbetsgivare',
      description: hit.description?.text || '',
      location: hit.workplace_address?.municipality || '',
      url: hit.webpage_url || `https://arbetsformedlingen.se/platsbanken/annonser/${hit.id}`,
      published: hit.publication_date
    };
  } catch (error) {
    console.error('Failed to fetch job:', error);
    return null;
  }
}