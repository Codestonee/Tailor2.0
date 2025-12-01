import * as pdfjsLib from 'pdfjs-dist';

// Hämta workern lokalt från node_modules via Vite
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

// Konfigurera PDF.js att använda den lokala workern
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Ladda dokumentet
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  
  // Loopa igenom alla sidor
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Extrahera textsträngar och slå ihop
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
      
    fullText += pageText + '\n';
  }
  
  return fullText;
}

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    return extractTextFromPDF(file);
  } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    return file.text();
  } else {
    // Fallback om filtypen inte känns igen men är textläsbar
    try {
        return file.text();
    } catch (e) {
        throw new Error('Unsupported file type');
    }
  }
}