-- Additional users for the forum
INSERT INTO public.users (email, username) VALUES 
    ('maya@auroville.org', 'MayaGreen'),
    ('prakash@auroville.org', 'SolarPrakash'),
    ('indra@auroville.org', 'IndraDesigner'),
    ('amit@auroville.org', 'AmitCode'),
    ('priya@auroville.org', 'PriyaEarth'),
    ('deepak@auroville.org', 'DeepakWater'),
    ('leela@auroville.org', 'LeelaHarmony'),
    ('arjun@auroville.org', 'ArjunBuilder'),
    ('tara@auroville.org', 'TaraSky'),
    ('vijay@auroville.org', 'VijayTech');

-- Forum topics for Announcements category
INSERT INTO public.forum_topics (title, content, category_id, created_by, created_at, is_pinned, view_count)
VALUES 
    ('New community guidelines for 2025', 
     'Dear Auroville community,\n\nWe are excited to announce the updated community guidelines for 2025. These guidelines aim to foster a more inclusive and sustainable community environment.\n\n**Key changes include:**\n\n1. Updated resource sharing protocols\n2. New conflict resolution pathways\n3. Revised sustainability commitments\n4. Enhanced digital participation guidelines\n\nPlease take the time to review these guidelines at the community center or online at our portal. There will be an open forum to discuss these changes next week.\n\nIn unity,\nThe Auroville Council', 
     (SELECT id FROM public.forum_categories WHERE name = 'Announcements'), 
     (SELECT id FROM public.users WHERE username = 'AuroAdmin'), 
     '2025-03-10 14:30:00+00', 
     TRUE, 
     156),
     
    ('Solar Kitchen expansion project approved', 
     'We''re happy to announce that the Solar Kitchen expansion project has been approved by the planning committee. Construction will begin next month and is expected to be completed by the end of the year.\n\nThe expanded kitchen will be able to serve up to 2,000 meals per day, up from the current capacity of 1,200. It will also feature new energy-efficient cooking equipment and expanded seating areas.\n\nVolunteers who wish to help with the project can sign up at the community center.',
     (SELECT id FROM public.forum_categories WHERE name = 'Announcements'), 
     (SELECT id FROM public.users WHERE username = 'CommunityLead'), 
     '2025-03-08 09:15:00+00', 
     TRUE, 
     124);

-- Forum topics for Community Projects category
INSERT INTO public.forum_topics (title, content, category_id, created_by, created_at, view_count)
VALUES 
    ('API Integration for Auroville Resource Sharing Platform', 
     'Hello everyone,\n\nI''m working on the API for our resource sharing platform. We need to implement an endpoint for upserting resource categories. Here''s what I have in mind:\n\n```\nPOST /api/v1/resources/categories\n```\n\nThis endpoint would accept a Resource Category object with these properties:\n- name (required): string\n- description: string\n- parentId: string (UUID of parent category)\n- attributes: array of attribute objects\n\nBefore I implement this, I wanted to get feedback from the community. Any suggestions or concerns?',
     (SELECT id FROM public.forum_categories WHERE name = 'Community Projects'), 
     (SELECT id FROM public.users WHERE username = 'AmitCode'), 
     '2025-03-11 11:20:00+00', 
     87),
     
    ('Bulk import tool for community knowledge base', 
     'I''m migrating our old knowledge base to the new Auroville platform, and I have a lot of legacy content that needs to be imported. Currently trying to figure out the best approach.\n\nOptions I''m considering:\n1. Direct database import (fastest but potential data integrity issues)\n2. API-based import (slower but safer)\n3. Manual entry for most important documents, automated import for the rest\n\nThe old system allows export to XML or JSON. Has anyone done something similar that could offer advice? Particularly interested in preserving the document hierarchy and attachments.',
     (SELECT id FROM public.forum_categories WHERE name = 'Community Projects'), 
     (SELECT id FROM public.users WHERE username = 'VijayTech'), 
     '2025-03-09 16:45:00+00', 
     65);

-- Forum topics for Sustainability category
INSERT INTO public.forum_topics (title, content, category_id, created_by, created_at, view_count)
VALUES 
    ('How can we improve water conservation in our community?', 
     'Water scarcity is becoming a pressing issue. I would like to discuss potential solutions and practices we can implement to conserve water in our daily lives.\n\nSome ideas I have:\n\n1. Rainwater harvesting systems for more buildings\n2. Greywater recycling for gardens\n3. More efficient irrigation systems\n4. Community education on water-saving practices\n\nWhat methods have worked well in your living areas? Any technologies or practices you''d recommend?',
     (SELECT id FROM public.forum_categories WHERE name = 'Sustainability'), 
     (SELECT id FROM public.users WHERE username = 'DeepakWater'), 
     '2025-03-09 09:45:00+00', 
     92),
     
    ('Zero-waste initiatives: What''s working and what''s not', 
     'We''ve had several zero-waste initiatives over the past year, and I think it''s time to evaluate what''s working and what needs improvement.\n\nSuccesses:\n- The community composting program\n- Plastic-free market days\n- Repair café events\n\nChallenges:\n- Packaging from external supplies\n- Tourism waste management\n- Construction waste\n\nI''d love to hear about your experiences and suggestions. Have you encountered obstacles in your zero-waste journey? What solutions have you found?',
     (SELECT id FROM public.forum_categories WHERE name = 'Sustainability'), 
     (SELECT id FROM public.users WHERE username = 'PriyaEarth'), 
     '2025-03-07 14:30:00+00', 
     78);

-- Forum topics for Volunteer Opportunities category
INSERT INTO public.forum_topics (title, content, category_id, created_by, created_at, view_count)
VALUES 
    ('Volunteers needed for forest restoration project', 
     'We are looking for volunteers to help with our forest restoration project. The project will run for 3 months starting April 2025.\n\nActivities include:\n- Tree planting\n- Maintenance of existing plantations\n- Seed collection and nursery work\n- Soil conservation measures\n\nNo prior experience is necessary, as training will be provided. We need people who can commit to at least 2 days per week. Housing is available for those coming from outside Auroville.\n\nIf you''re interested, please respond here or contact the Auroville Forest Group directly.',
     (SELECT id FROM public.forum_categories WHERE name = 'Volunteer Opportunities'), 
     (SELECT id FROM public.users WHERE username = 'MayaGreen'), 
     '2025-03-08 16:20:00+00', 
     210),
     
    ('Tech skills needed: Website accessibility improvement', 
     'We''re looking for volunteers with web development skills to help improve the accessibility of Auroville''s websites. This is an important initiative to ensure our digital resources are available to everyone, regardless of ability.\n\nSpecific skills needed:\n- Experience with WCAG 2.2 standards\n- HTML/CSS/JavaScript knowledge\n- Familiarity with screen readers and other assistive technologies\n- UI/UX design (a plus)\n\nTime commitment is flexible, and work can be done remotely. This is a great opportunity to contribute your technical skills to a meaningful project.\n\nPlease reply if you''re interested or have questions!',
     (SELECT id FROM public.forum_categories WHERE name = 'Volunteer Opportunities'), 
     (SELECT id FROM public.users WHERE username = 'IndraDesigner'), 
     '2025-03-06 13:10:00+00', 
     95);

-- Forum topics for Cultural Exchange category
INSERT INTO public.forum_topics (title, content, category_id, created_by, created_at, view_count)
VALUES 
    ('Traditional dance workshop this weekend', 
     'I am organizing a traditional dance workshop this weekend. All skill levels are welcome. Please join us for a fun and cultural experience!\n\nDetails:\n- Date: Saturday, March 15, 2025\n- Time: 3:00 PM - 6:00 PM\n- Location: Unity Pavilion\n- What to bring: Comfortable clothes, water, and an open mind\n\nThe workshop will feature dance styles from South India, with a focus on Bharatanatyam basics. We''ll also explore how these traditional movements can be integrated into contemporary expression.\n\nNo registration needed - just show up!',
     (SELECT id FROM public.forum_categories WHERE name = 'Cultural Exchange'), 
     (SELECT id FROM public.users WHERE username = 'LeelaHarmony'), 
     '2025-03-07 11:10:00+00', 
     88),
     
    ('International Potluck: Sharing culinary traditions', 
     'We''re organizing an international potluck dinner as part of our ongoing cultural exchange program. The theme is "Grandmother''s Recipes" - bring a dish that has been passed down in your family or represents your cultural heritage.\n\nWhen: Friday, March 21, 7:00 PM\nWhere: Solar Kitchen outdoor area\n\nPlease bring:\n- Your special dish (enough for about 8-10 people to sample)\n- The story behind the recipe\n- Your own plate, cup, and utensils (to reduce waste)\n\nWe''ll provide tables, basic beverages, and a sound system for background music. If you can help with setup or cleanup, please let me know in the replies.',
     (SELECT id FROM public.forum_categories WHERE name = 'Cultural Exchange'), 
     (SELECT id FROM public.users WHERE username = 'TaraSky'), 
     '2025-03-05 18:45:00+00', 
     76);

-- Forum topics for Spiritual Growth category
INSERT INTO public.forum_topics (title, content, category_id, created_by, created_at, view_count)
VALUES 
    ('Meditation techniques for beginners', 
     'I would like to share some meditation techniques that have helped me as a beginner. These are simple practices that anyone can incorporate into their daily routine.\n\n**1. Breath Awareness (5 minutes)**\nSimply sit comfortably and focus on your natural breath. Notice the sensation of air entering and leaving your nostrils. When your mind wanders, gently bring it back to your breath.\n\n**2. Body Scan (10 minutes)**\nLie down or sit comfortably. Bring awareness to each part of your body, starting from your toes and moving up to your head. Notice any sensations without judgment.\n\n**3. Sound Meditation (5-10 minutes)**\nSit quietly and open your awareness to all the sounds around you. Don''t analyze or label them, just notice them as they arise and pass away.\n\nWhat beginner-friendly meditation techniques have worked for you?',
     (SELECT id FROM public.forum_categories WHERE name = 'Spiritual Growth'), 
     (SELECT id FROM public.users WHERE username = 'PriyaEarth'), 
     '2025-03-06 08:50:00+00', 
     175),
     
    ('Group reading of Sri Aurobindo''s "The Life Divine"', 
     'I''m interested in starting a group to read and discuss Sri Aurobindo''s "The Life Divine" together. This is a profound text that can be challenging to approach alone.\n\nMy proposal is to meet once a week for about 1.5 hours. We would read a section beforehand and then discuss its meaning and relevance to our lives during the meeting.\n\nI''m thinking of starting next month, meeting on Wednesday evenings at 7:30 PM at the Reading Room. If there''s enough interest, we might create multiple groups.\n\nPlease reply if you''re interested or have suggestions about the format.',
     (SELECT id FROM public.forum_categories WHERE name = 'Spiritual Growth'), 
     (SELECT id FROM public.users WHERE username = 'SolarPrakash'), 
     '2025-03-04 17:30:00+00', 
     120);

-- Forum topics for General Discussion category
INSERT INTO public.forum_topics (title, content, category_id, created_by, created_at, view_count)
VALUES 
    ('Ideas for Expanding the Solar Kitchen?', 
     'The Solar Kitchen is amazing, but with more residents, should we scale it up? Thoughts on funding and design?\n\nI\'ve been thinking about how we might expand the capacity while maintaining the sustainable aspects. Some ideas:\n\n1. Additional cooking stations powered by concentrated solar\n2. Expanded outdoor seating with green canopy\n3. Integration with new food production systems (aquaponics, etc.)\n4. Community cooking classes and workshops in a dedicated space\n\nWhat do you think would be most beneficial? Any concerns about expansion?',
     (SELECT id FROM public.forum_categories WHERE name = 'General Discussion'), 
     (SELECT id FROM public.users WHERE username = 'SolarPrakash'), 
     '2025-03-11 08:45:00+00', 
     38),
     
    ('Improving mobile connectivity in Auroville', 
     'Has anyone else been experiencing poor mobile connectivity around Auroville lately? I find that in many areas, especially near the Matrimandir Gardens and parts of the Residential Zone, the signal drops completely.\n\nI understand we want to minimize electromagnetic pollution, but reliable communication is also important, especially in emergency situations.\n\nPossible solutions:\n- Working with providers to optimize existing tower placement\n- Community mesh networks as an alternative\n- Designated "connectivity zones" with boosters\n\nWhat has your experience been? Any technical solutions that balance our values with practical needs?',
     (SELECT id FROM public.forum_categories WHERE name = 'General Discussion'), 
     (SELECT id FROM public.users WHERE username = 'AmitCode'), 
     '2025-03-10 13:20:00+00', 
     45);

-- Now add some posts (replies) to the topics
-- Replies to "New community guidelines for 2025"
INSERT INTO public.forum_posts (content, topic_id, created_by, created_at)
VALUES 
    ('Thank you for the update. Could you clarify what you mean by "Enhanced digital participation guidelines"? Does this relate to our online meetings or something broader?', 
     (SELECT id FROM public.forum_topics WHERE title = 'New community guidelines for 2025'), 
     (SELECT id FROM public.users WHERE username = 'IndraDesigner'), 
     '2025-03-10 15:45:00+00'),
     
    ('I appreciate the updates, but I feel that the sustainability commitments could go further. Given the climate challenges we''re facing, I believe we should set more ambitious goals for carbon neutrality and regenerative practices. Would it be possible to revisit this section before finalizing?', 
     (SELECT id FROM public.forum_topics WHERE title = 'New community guidelines for 2025'), 
     (SELECT id FROM public.users WHERE username = 'MayaGreen'), 
     '2025-03-10 17:30:00+00'),
     
    ('The digital participation guidelines cover several areas: ethical considerations for our online platforms, accessibility standards to ensure everyone can participate, data privacy commitments, and protocols for remote decision-making. We''re trying to create a framework that allows for meaningful digital engagement while preserving our community values in online spaces.', 
     (SELECT id FROM public.forum_topics WHERE title = 'New community guidelines for 2025'), 
     (SELECT id FROM public.users WHERE username = 'AuroAdmin'), 
     '2025-03-11 09:15:00+00');

-- Replies to "Solar Kitchen expansion project approved"
INSERT INTO public.forum_posts (content, topic_id, created_by, created_at)
VALUES 
    ('This is fantastic news! The Solar Kitchen has been at capacity for too long. Will the construction disrupt the current meal service? I''m wondering if we should organize community cooking groups during the transition period.', 
     (SELECT id FROM public.forum_topics WHERE title = 'Solar Kitchen expansion project approved'), 
     (SELECT id FROM public.users WHERE username = 'LeelaHarmony'), 
     '2025-03-08 10:30:00+00'),
     
    ('Will the new kitchen continue to use the existing solar bowl technology, or will there be updates to that system as well? I''ve been researching some innovations in concentrated solar cooking that might be worth considering while we''re expanding.', 
     (SELECT id FROM public.forum_topics WHERE title = 'Solar Kitchen expansion project approved'), 
     (SELECT id FROM public.users WHERE username = 'SolarPrakash'), 
     '2025-03-08 11:45:00+00');

-- Replies to "How can we improve water conservation in our community?"
INSERT INTO public.forum_posts (content, topic_id, created_by, created_at)
VALUES 
    ('In our housing cluster, we installed shower water recycling systems that filter and treat shower water for toilet flushing. It was a moderate investment but has reduced our freshwater consumption by about 30%. I''d be happy to share the design and costs for anyone interested.', 
     (SELECT id FROM public.forum_topics WHERE title = 'How can we improve water conservation in our community?'), 
     (SELECT id FROM public.users WHERE username = 'ArjunBuilder'), 
     '2025-03-09 10:30:00+00'),
     
    ('I think we should also consider our landscaping practices. Many areas still have plants that require significant irrigation. We could transition to more drought-resistant native species and save substantial amounts of water. The Botanical Gardens has an excellent collection of water-wise plants that thrive in our climate.', 
     (SELECT id FROM public.forum_topics WHERE title = 'How can we improve water conservation in our community?'), 
     (SELECT id FROM public.users WHERE username = 'MayaGreen'), 
     '2025-03-09 12:15:00+00'),
     
    ('These are all excellent ideas. I''d like to add that water conservation is also about awareness and habits. Perhaps we could organize a "Water Consciousness Month" with workshops, challenges, and information campaigns. Simple changes like shorter showers and fixing leaks can make a big difference when everyone participates.', 
     (SELECT id FROM public.forum_topics WHERE title = 'How can we improve water conservation in our community?'), 
     (SELECT id FROM public.users WHERE username = 'CommunityLead'), 
     '2025-03-09 14:20:00+00'),
     
    ('I really like the greywater recycling idea. @ArjunBuilder, would you be willing to host a workshop to show us how your system works? I think many of us would be interested in implementing something similar.', 
     (SELECT id FROM public.forum_topics WHERE title = 'How can we improve water conservation in our community?'), 
     (SELECT id FROM public.users WHERE username = 'DeepakWater'), 
     '2025-03-10 08:45:00+00');

-- Replies to "Volunteers needed for forest restoration project"
INSERT INTO public.forum_posts (content, topic_id, created_by, created_at)
VALUES 
    ('I would love to join this project! I can commit to Tuesdays and Thursdays every week. I have some experience with nursery work from previous volunteering. How do I officially sign up?', 
     (SELECT id FROM public.forum_topics WHERE title = 'Volunteers needed for forest restoration project'), 
     (SELECT id FROM public.users WHERE username = 'TaraSky'), 
     '2025-03-08 17:45:00+00'),
     
    ('This sounds like a wonderful initiative. I can''t commit to regular days due to my work schedule, but I could join weekend activities if that''s possible. Also, I have access to a truck if transportation of saplings or materials is needed.', 
     (SELECT id FROM public.forum_topics WHERE title = 'Volunteers needed for forest restoration project'), 
     (SELECT id FROM public.users WHERE username = 'VijayTech'), 
     '2025-03-09 07:30:00+00'),
     
    ('Thanks for your interest! @TaraSky, that''s perfect - please email forestgroup@auroville.org with your details, and we''ll add you to the schedule. @VijayTech, weekend help would be very welcome - we typically have special weekend sessions for those who can''t make it during the week. And the offer of a truck is much appreciated! We''ll definitely need transport help for some of the larger planting days.', 
     (SELECT id FROM public.forum_topics WHERE title = 'Volunteers needed for forest restoration project'), 
     (SELECT id FROM public.users WHERE username = 'MayaGreen'), 
     '2025-03-09 09:15:00+00');

-- Replies to "Traditional dance workshop this weekend"
INSERT INTO public.forum_posts (content, topic_id, created_by, created_at)
VALUES 
    ('This sounds wonderful! Will there be any live music accompanying the dance, or will you be using recorded tracks?', 
     (SELECT id FROM public.forum_topics WHERE title = 'Traditional dance workshop this weekend'), 
     (SELECT id FROM public.users WHERE username = 'PriyaEarth'), 
     '2025-03-07 12:30:00+00'),
     
    ('I''d like to attend but have a mild knee injury. Are there modifications available for people with limited mobility?', 
     (SELECT id FROM public.forum_topics WHERE title = 'Traditional dance workshop this weekend'), 
     (SELECT id FROM public.users WHERE username = 'SolarPrakash'), 
     '2025-03-07 15:45:00+00'),
     
    ('@PriyaEarth We''ll have both! For the first half, we''ll use recorded music for learning the basic steps. In the second half, we have two musicians joining us with mridangam and violin for a more immersive experience.\n\n@SolarPrakash Absolutely! Many of the upper body movements and expressions can be practiced while seated, and I''ll be offering modifications for all the footwork. Please come a few minutes early so I can show you some specific adaptations for your needs.', 
     (SELECT id FROM public.forum_topics WHERE title = 'Traditional dance workshop this weekend'), 
     (SELECT id FROM public.users WHERE username = 'LeelaHarmony'), 
     '2025-03-08 10:20:00+00');

-- Replies to "Meditation techniques for beginners"
INSERT INTO public.forum_posts (content, topic_id, created_by, created_at)
VALUES 
    ('Thank you for sharing these techniques! I''ve been trying to establish a meditation practice but often get discouraged because my mind wanders so much. The breath awareness technique seems like a good place to start. How long did it take you to notice benefits when you first began?', 
     (SELECT id FROM public.forum_topics WHERE title = 'Meditation techniques for beginners'), 
     (SELECT id FROM public.users WHERE username = 'AmitCode'), 
     '2025-03-06 09:30:00+00'),
     
    ('I''d add one more technique that helped me tremendously as a beginner: Guided meditations. There are many excellent recordings available, and having a voice guiding you through the process can be very helpful when you''re just starting out. It gives the mind something to focus on and provides structure to the practice.', 
     (SELECT id FROM public.forum_topics WHERE title = 'Meditation techniques for beginners'), 
     (SELECT id FROM public.users WHERE username = 'LeelaHarmony'), 
     '2025-03-06 11:20:00+00'),
     
    ('One thing that really helped me was reframing what "success" means in meditation. It''s not about having no thoughts, but about gently returning your awareness each time you notice it has wandered. Each time you do that is like a rep in mental training - that IS the practice. I found this perspective made me less frustrated and more consistent.', 
     (SELECT id FROM public.forum_topics WHERE title = 'Meditation techniques for beginners'), 
     (SELECT id FROM public.users WHERE username = 'SolarPrakash'), 
     '2025-03-06 14:45:00+00'),
     
    ('@AmitCode I noticed subtle benefits within the first week - mainly that I was a bit more aware of when I was getting stressed during the day. The more significant benefits like improved focus and emotional regulation took about 3-4 weeks of daily practice (even if just for 5 minutes). So I''d encourage you to stick with it!\n\n@LeelaHarmony Great suggestion about guided meditations! I should have included that.\n\n@SolarPrakash That''s such an important reframing. When I understood that noticing the wandering and bringing attention back IS the practice, not a failure of practice, it changed everything for me.', 
     (SELECT id FROM public.forum_topics WHERE title = 'Meditation techniques for beginners'), 
     (SELECT id FROM public.users WHERE username = 'PriyaEarth'), 
     '2025-03-07 08:30:00+00'),
     
    ('I''ve found that consistency is more important than duration. Five minutes every day is much more beneficial than an hour once a week. Also, meditating at the same time each day helps turn it into a habit. For me, it''s first thing in the morning, before checking any devices.', 
     (SELECT id FROM public.forum_topics WHERE title = 'Meditation techniques for beginners'), 
     (SELECT id FROM public.users WHERE username = 'CommunityLead'), 
     '2025-03-07 10:15:00+00');
     
-- Replies to "Ideas for Expanding the Solar Kitchen?"
INSERT INTO public.forum_posts (content, topic_id, created_by, created_at)
VALUES 
    ('Crowdfunding could work! Maybe add a rooftop garden too? It would provide some insulation for the building, supply fresh herbs and vegetables directly to the kitchen, and create a beautiful space for community gatherings.', 
     (SELECT id FROM public.forum_topics WHERE title = 'Ideas for Expanding the Solar Kitchen?'), 
     (SELECT id FROM public.users WHERE username = 'MayaGreen'), 
     '2025-03-11 09:15:00+00'),
     
    ('I support the expansion, but we should be careful about the design. The current building has excellent natural ventilation that keeps it cool. Any expansion should maintain this principle. I''ve seen too many "modernized" community kitchens that end up being hot and uncomfortable to work in. Perhaps we could organize a design charette with architects, kitchen staff, and regular users to ensure all perspectives are considered?', 
     (SELECT id FROM public.forum_topics WHERE title = 'Ideas for Expanding the Solar Kitchen?'), 
     (SELECT id FROM public.users WHERE username = 'ArjunBuilder'), 
     '2025-03-11 10:45:00+00');

-- Add some reactions to posts
INSERT INTO public.post_reactions (post_id, user_id, reaction_type)
VALUES
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'Thank you for the update%'), (SELECT id FROM public.users WHERE username = 'AuroAdmin'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'Thank you for the update%'), (SELECT id FROM public.users WHERE username = 'MayaGreen'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'I appreciate the updates%'), (SELECT id FROM public.users WHERE username = 'DeepakWater'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'I appreciate the updates%'), (SELECT id FROM public.users WHERE username = 'PriyaEarth'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'The digital participation guidelines%'), (SELECT id FROM public.users WHERE username = 'IndraDesigner'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'The digital participation guidelines%'), (SELECT id FROM public.users WHERE username = 'MayaGreen'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'This is fantastic news%'), (SELECT id FROM public.users WHERE username = 'AuroAdmin'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'This is fantastic news%'), (SELECT id FROM public.users WHERE username = 'CommunityLead'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'Will the new kitchen%'), (SELECT id FROM public.users WHERE username = 'AuroAdmin'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'In our housing cluster%'), (SELECT id FROM public.users WHERE username = 'DeepakWater'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'In our housing cluster%'), (SELECT id FROM public.users WHERE username = 'MayaGreen'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'In our housing cluster%'), (SELECT id FROM public.users WHERE username = 'PriyaEarth'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'I think we should also consider%'), (SELECT id FROM public.users WHERE username = 'DeepakWater'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'I think we should also consider%'), (SELECT id FROM public.users WHERE username = 'ArjunBuilder'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'These are all excellent%'), (SELECT id FROM public.users WHERE username = 'DeepakWater'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'I really like the greywater%'), (SELECT id FROM public.users WHERE username = 'ArjunBuilder'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'I would love to join%'), (SELECT id FROM public.users WHERE username = 'MayaGreen'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'This sounds like a wonderful%'), (SELECT id FROM public.users WHERE username = 'MayaGreen'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'Thanks for your interest%'), (SELECT id FROM public.users WHERE username = 'TaraSky'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'Thanks for your interest%'), (SELECT id FROM public.users WHERE username = 'VijayTech'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'This sounds wonderful%'), (SELECT id FROM public.users WHERE username = 'LeelaHarmony'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'I''d like to attend%'), (SELECT id FROM public.users WHERE username = 'LeelaHarmony'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE '@PriyaEarth We''ll have%'), (SELECT id FROM public.users WHERE username = 'PriyaEarth'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE '@PriyaEarth We''ll have%'), (SELECT id FROM public.users WHERE username = 'SolarPrakash'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE 'Thank you for sharing%'), (SELECT id FROM public.users WHERE username = 'PriyaEarth'), 'like'),
    ((SELECT id FROM public.forum_posts WHERE content LIKE
