-- Insert 2026-2027 Para Shooting Calendar Events
-- This script populates the events table with all domestic and international competitions
-- NOSONAR: String literal duplication in INSERT statements is required for data values
INSERT INTO events (
        title,
        slug,
        description,
        location,
        start_date,
        end_date,
        status,
        is_featured
    )
VALUES -- 1. 1st Junior Coaching Camp
    (
        '1st Junior Coaching Camp',
        '1st-junior-coaching-camp-2026',
        'Junior coaching camp covering Rifle, Pistol and VI disciplines. Duration: 15 days',
        'New Delhi',
        '2026-01-27 00:00:00+05:30',
        '2026-02-10 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 2. Foreign Camp and Barrel Testing Germany
    (
        'Foreign Camp and Barrel Testing - Germany',
        'foreign-camp-barrel-testing-germany-2026',
        'International training camp in Germany for Rifle and Pistol barrel testing',
        'Germany',
        '2026-02-15 00:00:00+01:00',
        '2026-02-21 23:59:59+01:00',
        'upcoming',
        true
    ),
    -- 3. 3rd Para Khelo India Games
    (
        '3rd Para Khelo India Games',
        '3rd-para-khelo-india-games-2026',
        'National para sports competition featuring Rifle and Pistol events',
        'TBC',
        '2026-03-01 00:00:00+05:30',
        '2026-03-31 23:59:59+05:30',
        'upcoming',
        true
    ),
    -- 4. National Squad Coaching Camp
    (
        'National Squad Coaching Camp',
        'national-squad-coaching-camp-april-2026',
        'Comprehensive coaching camp for Rifle, Pistol, VI and Shotgun disciplines. Duration: 15 days',
        'New Delhi',
        '2026-04-01 00:00:00+05:30',
        '2026-04-15 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 5. 2nd Junior Coaching Camp
    (
        '2nd Junior Coaching Camp',
        '2nd-junior-coaching-camp-2026',
        'Junior coaching camp covering Rifle, Pistol and VI disciplines. Duration: 15 days',
        'TBC',
        '2026-05-22 00:00:00+05:30',
        '2026-06-05 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 6. National Selection Trials - 1 & 2 (Dashes Fixed)
    (
        'National Selection Trials - 1 & 2',
        'national-selection-trials-1-2-june-2026',
        'National selection trials for Rifle, Pistol, VI and Shotgun disciplines',
        'New Delhi',
        '2026-06-08 00:00:00+05:30',
        '2026-06-14 23:59:59+05:30',
        'upcoming',
        true
    ),
    -- 7. Preparatory National Coaching camp for Novi Saad WSPS World Cup
    (
        'Preparatory Camp for Novi Saad WSPS World Cup',
        'preparatory-camp-novi-saad-wsps-2026',
        'Preparatory coaching camp for Rifle, Pistol and VI athletes. Duration: 10 days',
        'New Delhi',
        '2026-07-10 00:00:00+05:30',
        '2026-07-19 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 8. Novi Saad 2026 WSPS World Cup
    (
        'Novi Saad 2026 WSPS World Cup',
        'novi-saad-wsps-world-cup-2026',
        'WSPS World Cup featuring Rifle, Pistol and VI events',
        'Novi Saad, Serbia',
        '2026-07-21 00:00:00+02:00',
        '2026-07-31 23:59:59+02:00',
        'upcoming',
        true
    ),
    -- 9. Preparatory National Coaching camp for Changwon WSPS World Championship
    (
        'Preparatory Camp for Changwon WSPS World Championship',
        'preparatory-camp-changwon-wsps-2026',
        'Preparatory coaching camp for Rifle, Pistol, VI and Shotgun athletes. Duration: 15 days',
        'New Delhi',
        '2026-08-20 00:00:00+05:30',
        '2026-09-05 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 10. 2026 Changwon WSPS World Championship
    (
        '2026 Changwon WSPS World Championship',
        'changwon-wsps-world-championship-2026',
        'WSPS World Championship featuring Rifle, Pistol, VI and Shotgun events',
        'Changwon, South Korea',
        '2026-09-07 00:00:00+09:00',
        '2026-09-18 23:59:59+09:00',
        'upcoming',
        true
    ),
    -- 11. 5th Asian Para Games Preparatory Coaching Camp
    (
        '5th Asian Para Games Preparatory Camp',
        '5th-asian-para-games-preparatory-camp-2026',
        'Preparatory coaching camp for Rifle and Pistol athletes. Duration: 15 days',
        'New Delhi',
        '2026-09-30 00:00:00+05:30',
        '2026-10-14 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 12. 5th Asian Para Games
    (
        '5th Asian Para Games',
        '5th-asian-para-games-2026',
        'Asian Para Games featuring Rifle and Pistol events',
        'Aichi-Nagoya, Japan',
        '2026-10-16 00:00:00+09:00',
        '2026-10-24 23:59:59+09:00',
        'upcoming',
        true
    ),
    -- 13. 7th Zonal Para shooting Competition
    (
        '7th Zonal Para Shooting Competition',
        '7th-zonal-para-shooting-competition-2026',
        'Zonal competition covering Rifle, Pistol, VI and Shotgun disciplines',
        'TBC',
        '2026-11-08 00:00:00+05:30',
        '2026-11-14 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 14. 7th National Para Shooting Championship
    (
        '7th National Para Shooting Championship',
        '7th-national-para-shooting-championship-2026',
        'National championship covering Rifle, Pistol, VI and Shotgun disciplines',
        'TBC',
        '2026-11-15 00:00:00+05:30',
        '2026-11-21 23:59:59+05:30',
        'upcoming',
        true
    ),
    -- 15. Preparatory National Coaching camp for Al Ain WSPS World Cup
    (
        'Preparatory Camp for Al Ain WSPS World Cup',
        'preparatory-camp-al-ain-wsps-2026',
        'Preparatory coaching camp for Rifle, Pistol, VI and Shotgun athletes. Duration: 10 days',
        'New Delhi',
        '2026-11-26 00:00:00+05:30',
        '2026-12-05 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 16. Al Ain 2026 WSPS World Cup
    (
        'Al Ain 2026 WSPS World Cup',
        'al-ain-wsps-world-cup-2026',
        'WSPS World Cup featuring Rifle, Pistol, VI and Shotgun events',
        'Al Ain, UAE',
        '2026-12-07 00:00:00+04:00',
        '2026-12-19 23:59:59+04:00',
        'upcoming',
        true
    ),
    -- 17. 3rd Junior Coaching Camp
    (
        '3rd Junior Coaching Camp',
        '3rd-junior-coaching-camp-2027',
        'Junior coaching camp covering Rifle, Pistol and VI disciplines. Duration: 15 days',
        'TBC',
        '2027-02-01 00:00:00+05:30',
        '2027-02-15 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 18. Selection Trials - 1 & 2 (Dashes Fixed)
    (
        'Selection Trials - 1 & 2',
        'selection-trials-1-2-february-2027',
        'National selection trials for Rifle, Pistol, VI and Shotgun disciplines',
        'TBC',
        '2027-02-15 00:00:00+05:30',
        '2027-02-21 23:59:59+05:30',
        'upcoming',
        true
    ),
    -- 19. National Squad Coaching Camp (February 2027)
    (
        'National Squad Coaching Camp',
        'national-squad-coaching-camp-february-2027',
        'Comprehensive coaching camp for Rifle, Pistol, VI and Shotgun disciplines. Duration: 15 days',
        'TBC',
        '2027-02-22 00:00:00+05:30',
        '2027-03-08 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 20. 4th Para Khelo India Games
    (
        '4th Para Khelo India Games',
        '4th-para-khelo-india-games-2027',
        'National para sports competition featuring Rifle and Pistol events',
        'TBC',
        '2027-03-01 00:00:00+05:30',
        '2027-03-31 23:59:59+05:30',
        'upcoming',
        true
    ),
    -- 21. WSPS Technical Course (Judges)
    (
        'WSPS Technical Course (Judges) 2027',
        'wsps-technical-course-judges-2027',
        'Technical training course for judges covering Rifle, Pistol, VI and Shotgun disciplines',
        'TBC',
        '2027-06-01 00:00:00+05:30',
        '2027-06-07 23:59:59+05:30',
        'upcoming',
        false
    ),
    -- 22. WSPS Coaches Course
    (
        'WSPS Coaches Course 2027',
        'wsps-coaches-course-2027',
        'Professional coaching course covering Rifle, Pistol, VI and Shotgun disciplines',
        'TBC',
        '2027-07-01 00:00:00+05:30',
        '2027-07-07 23:59:59+05:30',
        'upcoming',
        false
    );