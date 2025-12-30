-- Add embedded PDF preview to the calendar news article
UPDATE news_articles
SET content = content || '

<h3>Preview Calendar</h3>
<div style="position: relative; width: 100%; padding-bottom: 141.4%; height: 0; overflow: hidden; max-width: 800px; margin: 20px auto;">
  <iframe src="https://drive.google.com/file/d/1bwL9g9zV3PZGuYq8JG53Efnrkws4emyP/preview" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid #ddd; border-radius: 8px;" allow="autoplay"></iframe>
</div>

<p style="text-align: center; margin-top: 10px;">
  <a href="https://drive.google.com/file/d/1bwL9g9zV3PZGuYq8JG53Efnrkws4emyP/preview" target="_blank" rel="noopener noreferrer" style="color: #003DA5; font-weight: bold;">Open in Full Screen →</a>
</p>'
WHERE slug = '2026-2027-para-shooting-calendar-released';