import React, { useState } from 'react';
import { Copy, Check, Mail, Linkedin, Clock, ChevronDown, ChevronUp, Coffee, Send, Briefcase, XCircle } from 'lucide-react';

export const EmailTemplates: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null); // Håller koll på vilken som är öppen

  const templates = [
    {
      id: 'follow-up',
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      title: 'Uppföljning av ansökan',
      desc: 'Skicka 1-2 veckor efter ansökan om du inte hört något.',
      subject: 'Uppföljning: Ansökan till tjänsten [Tjänst] - [Ditt Namn]',
      body: `Hej [Namn på rekryterare],

Jag skickade nyligen in en ansökan till tjänsten som [Tjänst] hos er och ville bara höra mig för om hur processen ser ut framöver.

Jag är fortfarande mycket intresserad av rollen och tror att min bakgrund inom [Din Spetskompetens] skulle passa väl in i ert team.

Hör gärna av dig om du behöver någon ytterligare information från min sida.

Vänliga hälsningar,
[Ditt Namn]`
    },
    {
      id: 'thank-you',
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: 'Tack efter intervju',
      desc: 'Skicka inom 24 timmar efter en intervju.',
      subject: 'Tack för ett trevligt samtal - [Ditt Namn]',
      body: `Hej [Namn],

Stort tack för att du tog dig tid att träffa mig idag. Det var väldigt intressant att höra mer om [Företaget] och rollen som [Tjänst].

Vårt samtal stärkte min känsla av att detta är rätt steg för mig. Särskilt intressant var det vi diskuterade kring [Nämn något specifikt ni pratade om].

Jag ser fram emot att höra från er om nästa steg!

Bästa hälsningar,
[Ditt Namn]`
    },
    {
      id: 'accept-interview',
      icon: <Briefcase className="w-5 h-5 text-green-600" />,
      title: 'Acceptera inbjudan till intervju',
      desc: 'Svara snabbt och bekräfta tid.',
      subject: 'Angående intervju för [Tjänst] - [Ditt Namn]',
      body: `Hej [Namn],

Tack för inbjudan! Jag kommer gärna på intervju för tjänsten som [Tjänst].

Tiden ni föreslog, [Datum och Tid], passar mig utmärkt. Jag ser fram emot att träffa er.

Vänliga hälsningar,
[Ditt Namn]`
    },
    {
      id: 'linkedin',
      icon: <Linkedin className="w-5 h-5 text-blue-600" />,
      title: 'LinkedIn Kontaktförfrågan',
      desc: 'För att connecta med rekryterare eller framtida kollegor.',
      subject: '',
      body: `Hej [Namn],

Jag såg att du jobbar på [Företaget] och är väldigt imponerad av det ni gör inom [Område]. 

Jag har precis sökt en tjänst hos er och skulle gärna vilja connecta här för att följa era uppdateringar.

Allt gott,
[Ditt Namn]`
    },
    {
      id: 'cold-outreach',
      icon: <Send className="w-5 h-5 text-purple-500" />,
      title: 'Spontanansökan / Connect',
      desc: 'När du kontaktar ett företag utan en specifik annons.',
      subject: 'Intresseanmälan: [Din Roll/Kompetens] - [Ditt Namn]',
      body: `Hej [Namn],

Jag har följt [Företaget] ett tag och är imponerad av [Nämn specifikt projekt eller värdering].

Jag är en [Din Titel] med erfarenhet av [Dina nyckelkompetenser] och letar nu efter min nästa utmaning. Även om ni inte har några utannonserade tjänster just nu, ville jag höra om ni är öppna för en förutsättningslös dialog?

Bifogar mitt CV och hoppas vi hörs!

Vänliga hälsningar,
[Ditt Namn]`
    },
    {
      id: 'networking',
      icon: <Coffee className="w-5 h-5 text-brown-500" />,
      title: 'Nätverkande / Kaffe',
      desc: 'För att be om råd eller ett kort möte.',
      subject: 'Fråga gällande [Bransch/Roll] - [Ditt Namn]',
      body: `Hej [Namn],

Jag ser att du har en spännande karriär inom [Område] och jag är själv på väg i den riktningen.

Hade du haft möjlighet att ta en kort digital kaffe (15 min)? Jag skulle verkligen uppskatta att få höra lite om dina erfarenheter kring [Specifik fråga].

Förstår om du har fullt upp, men uppskattar all tid du kan avvara!

Vänliga hälsningar,
[Ditt Namn]`
    },
    {
      id: 'decline',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: 'Tacka nej till erbjudande',
      desc: 'Håll dörren öppen för framtiden.',
      subject: 'Angående erbjudandet för [Tjänst] - [Ditt Namn]',
      body: `Hej [Namn],

Stort tack för erbjudandet om tjänsten som [Tjänst] och för den tid ni lagt ner.

Efter noga övervägande har jag dock valt att gå vidare med en annan möjlighet som bättre matchar mina långsiktiga mål just nu.

Jag har fått ett väldigt gott intryck av er och [Företaget], och hoppas att våra vägar korsas igen i framtiden.

Önskar er all lycka till med rekryteringen!

Vänliga hälsningar,
[Ditt Namn]`
    }
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {templates.map((template) => {
        const isExpanded = expandedId === template.id;

        return (
          <div 
            key={template.id} 
            className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-primary ring-1 ring-primary shadow-md' : 'border-neutral-200 hover:border-primary/50'}`}
          >
            {/* HEADER (Alltid synlig, klickbar) */}
            <button 
              onClick={() => toggleExpand(template.id)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg border transition-colors ${isExpanded ? 'bg-primary/10 border-primary/20' : 'bg-neutral-50 border-neutral-100'}`}>
                  {template.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isExpanded ? 'text-primary' : 'text-neutral-900'}`}>
                    {template.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{template.desc}</p>
                </div>
              </div>
              <div className={`text-neutral-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
                <ChevronDown size={20} />
              </div>
            </button>
            
            {/* EXPANDERAT INNEHÅLL */}
            {isExpanded && (
              <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-200">
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200/60 text-sm text-neutral-700 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                  {template.subject && (
                    <div className="mb-4 pb-4 border-b border-neutral-200 text-neutral-900 font-sans">
                      <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider block mb-1">Ämne</span>
                      {template.subject}
                    </div>
                  )}
                  <div>
                    <span className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider block mb-2 font-sans">Meddelande</span>
                    {template.body}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(template.subject ? `Ämne: ${template.subject}\n\n${template.body}` : template.body, template.id);
                    }}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm hover:shadow"
                  >
                    {copiedId === template.id ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === template.id ? 'Kopierad till urklipp!' : 'Kopiera text'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};