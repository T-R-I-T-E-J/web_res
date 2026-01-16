-- Seed Sample News Articles for Para Shooting Committee of India
-- Run this in your Neon.tech SQL Editor
-- Seed Sample News Articles for Para Shooting India
-- This script inserts 5 sample news articles into the news_articles table
-- First, delete any existing sample news articles (based on slug)
DELETE FROM public.news_articles
WHERE slug IN (
        'india-wins-gold-at-asian-para-games-2024',
        'national-para-shooting-championship-announced',
        'new-training-facility-inaugurated-in-delhi',
        'para-shooters-prepare-for-paris-2024',
        'youth-development-program-launched'
    );
-- Insert sample news articles
INSERT INTO public.news_articles (
        title,
        slug,
        excerpt,
        content,
        author_id,
        category,
        status,
        is_featured,
        published_at,
        created_at,
        updated_at
    )
VALUES (
        'India Wins Gold at Asian Para Shooting Championship 2026',
        'india-wins-gold-asian-para-shooting-championship-2026',
        'Indian para shooters dominated the Asian Para Shooting Championship, securing multiple gold medals and setting new records.',
        '<p>The Indian para shooting team has made the nation proud by winning multiple gold medals at the Asian Para Shooting Championship 2026 held in Bangkok, Thailand.</p><p>Our athletes showcased exceptional skill and determination, with several shooters setting new championship records in their respective categories.</p><p>This victory marks a significant milestone for Indian para sports and demonstrates the growing strength of our para shooting program.</p>',
        1,
        'achievements',
        'published',
        true,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days'
    ),
    (
        'National Para Shooting Camp Announced for March 2026',
        'national-para-shooting-camp-march-2026',
        'The Para Shooting Committee of India announces a comprehensive training camp for aspiring and elite para shooters.',
        '<p>The Para Shooting Committee of India is pleased to announce a National Para Shooting Camp scheduled for March 2026 at the Dr. Karni Singh Shooting Range in New Delhi.</p><p>The camp will provide intensive training to both emerging and elite para shooters, with coaching from national and international experts.</p><p>Athletes interested in participating can register through our official website. Selection will be based on recent performance and potential.</p>',
        1,
        'events',
        'published',
        true,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days'
    ),
    (
        'New Training Facility Inaugurated in Mumbai',
        'new-training-facility-inaugurated-mumbai',
        'State-of-the-art para shooting training facility opens in Mumbai, expanding access to world-class training infrastructure.',
        '<p>A new world-class para shooting training facility was inaugurated in Mumbai today, marking a significant step forward in developing para sports infrastructure in India.</p><p>The facility features 10 shooting ranges with adaptive equipment, dedicated coaching staff, and accommodation facilities for athletes.</p><p>This initiative is part of our commitment to making para shooting accessible to athletes across the country and nurturing future champions.</p>',
        1,
        'news',
        'published',
        false,
        NOW() - INTERVAL '7 days',
        NOW() - INTERVAL '7 days',
        NOW() - INTERVAL '7 days'
    ),
    (
        'Selection Trials for World Championship 2026 Announced',
        'selection-trials-world-championship-2026',
        'The Para Shooting Committee of India announces selection trials for the upcoming World Para Shooting Championship.',
        '<p>The Para Shooting Committee of India has announced selection trials for the World Para Shooting Championship 2026, scheduled to be held in Lima, Peru.</p><p>The trials will take place in April 2026 at designated shooting ranges across India. Athletes must meet the minimum qualification standards to be eligible for selection.</p><p>Detailed guidelines and registration information will be available on our website soon.</p>',
        1,
        'announcements',
        'published',
        false,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '10 days'
    ),
    (
        'Para Shooting Awareness Program Launched in Schools',
        'para-shooting-awareness-program-schools',
        'Initiative to introduce para shooting to students with disabilities across 100 schools nationwide.',
        '<p>The Para Shooting Committee of India has launched an awareness program to introduce para shooting to students with disabilities in schools across the country.</p><p>The program aims to identify and nurture young talent while promoting inclusivity in sports. Trained coaches will visit schools to conduct demonstrations and basic training sessions.</p><p>This grassroots initiative is expected to significantly expand the talent pool for Indian para shooting in the coming years.</p>',
        1,
        'news',
        'published',
        false,
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '15 days'
    );
-- Verify the inserted data
SELECT id,
    title,
    category,
    status,
    is_featured,
    published_at
FROM public.news_articles
ORDER BY published_at DESC;