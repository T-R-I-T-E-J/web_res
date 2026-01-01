-- Insert WSPS Grand Prix France 2026 News Article
INSERT INTO news_articles (
    title,
    slug,
    excerpt,
    content,
    featured_image_url,
    category,
    tags,
    author_id,
    status,
    is_featured,
    is_pinned,
    created_at,
    updated_at,
    published_at
  )
VALUES (
    'WSPS Grand Prix France 2026 and Champagne Cup Announced',
    'wsps-grand-prix-france-2026',
    'Official announcement for the WSPS Grand Prix France 2026 and Champagne Cup Shooting Parasport to be held from 26th Feb to 1st March 2026.',
    '<p>The Para Shooting Committee of India is pleased to announce the details for the upcoming <strong>WSPS Grand Prix France 2026</strong> and <strong>Champagne Cup Shooting Parasport</strong> (2nd competition).</p>
<p class="text-lg mb-4"><strong>📅 Date:</strong> 26th February - 1st March 2026</p>
<p>This prestigious event will bring together top para shooters from around the globe. Please refer to the official document below for detailed information regarding the event schedule, venue, and participation guidelines.</p>

<h3 class="text-xl font-bold mt-8 mb-4">Official Event Document</h3>
<div class="my-6 h-[800px] w-full border border-neutral-200 rounded-lg shadow-sm overflow-hidden bg-white">
    <iframe 
      src="/wsps-france-2026.pdf" 
      class="w-full h-full" 
      title="WSPS Grand Prix France 2026 Information"
    ></iframe>
</div>

<div class="mt-6 flex justify-center">
  <a href="/wsps-france-2026.pdf" target="_blank" class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md">
     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
     Download Official Circular (PDF)
  </a>
</div>',
    '/wsps-france-2026.png',
    'EVENT',
    '["wsps", "france", "2026", "grand-prix", "international"]'::jsonb,
    1,
    'published',
    true,
    false,
    NOW(),
    NOW(),
    NOW()
  );