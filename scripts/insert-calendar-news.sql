-- Insert news article about 2026-2027 Para Shooting Calendar
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
    published_at
  )
VALUES (
    '2026 - 2027 Para Shooting Calendar Released',
    '2026-2027-para-shooting-calendar-released',
    'The Para Shooting Committee of India announces the complete calendar for domestic and international competitions for 2026-2027, featuring 22 major events including World Cups, Championships, and National Camps.',
    '<h2>2026 - 2027 Para Shooting Calendar - Domestics and International Competition</h2>

<p>The Para Shooting Committee of India is pleased to announce the comprehensive competition and training calendar for 2026-2027. This calendar includes a total of 22 events covering domestic championships, international competitions, coaching camps, and technical courses.</p>

<h3>Highlights of the Calendar:</h3>

<ul>
<li><strong>International Competitions:</strong>
  <ul>
    <li>Novi Saad 2026 WSPS World Cup (Serbia)</li>
    <li>2026 Changwon WSPS World Championship (South Korea)</li>
    <li>5th Asian Para Games (Aichi-Nagoya, Japan)</li>
    <li>Al Ain 2026 WSPS World Cup (UAE)</li>
  </ul>
</li>

<li><strong>National Championships:</strong>
  <ul>
    <li>7th National Para Shooting Championship</li>
    <li>7th Zonal Para Shooting Competition</li>
    <li>3rd & 4th Para Khelo India Games</li>
  </ul>
</li>

<li><strong>Training & Development:</strong>
  <ul>
    <li>Multiple Junior Coaching Camps (3 camps scheduled)</li>
    <li>National Squad Coaching Camps</li>
    <li>Foreign Camp and Barrel Testing in Germany</li>
    <li>Preparatory camps for major international events</li>
  </ul>
</li>

<li><strong>Professional Development:</strong>
  <ul>
    <li>WSPS Technical Course for Judges</li>
    <li>WSPS Coaches Course</li>
  </ul>
</li>
</ul>

<h3>Disciplines Covered:</h3>
<p>The calendar covers all major para shooting disciplines including Rifle, Pistol, VI (Visually Impaired), and Shotgun events across SH1 and SH2 classifications.</p>

<h3>Selection Process:</h3>
<p>National Selection Trials will be conducted in June 2026 and February 2027 to identify athletes for international competitions.</p>

<p><strong>Download the complete calendar:</strong> <a href="https://drive.google.com/file/d/1bwL9g9zV3PZGuYq8JG53Efnrkws4emyP/view?usp=sharing" target="_blank" rel="noopener noreferrer">2026-2027 Para Shooting Calendar (PDF)</a></p>

<p>For more information about specific events, please visit our <a href="/events">Events Calendar</a> page.</p>',
    'https://drive.google.com/uc?export=view&id=1bwL9g9zV3PZGuYq8JG53Efnrkws4emyP',
    'ANNOUNCEMENT',
    '["calendar", "2026", "2027", "competitions", "world cup", "championship", "coaching camps"]'::jsonb,
    1,
    'published',
    true,
    true,
    NOW()
  );