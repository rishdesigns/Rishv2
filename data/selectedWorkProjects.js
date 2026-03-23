/**
 * SELECTED WORK PROJECTS - Single Source of Truth
 * 
 * This file manages all Selected Work projects and their inner pages.
 * Adding/removing projects here automatically manages:
 * - Selected Work grid display
 * - Dynamic inner page generation
 * - SEO metadata
 * - Routing
 */

export const selectedWorkProjects = [
    {
        id: 1,
        title: 'Stream X: Social Live Streaming Platform',
        slug: 'stream-x',
        category: 'Mobile',
        type: 'case-study', // 'case-study' or 'project'
        template: 'case-study-default', // Template HTML file to use
        shortDescription: 'A mobile-first UX strategy study in content discovery, live engagement, and creator trust.',
        heroPlaceholderImage: 'Assets/selectedwork/Streaming-App.webp',
        galleryPlaceholderImages: [
            'Assets/selectedwork/Streaming-App.webp',
            'Assets/selectedwork/Streaming-App.webp',
            'Assets/selectedwork/Streaming-App.webp'
        ],
        role: 'Lead UX/UI Designer',
        platform: 'iOS, Android',
        timeline: '',
        team: 'Solo',
        externalLinks: {
            behance: '', // Sample Behance link
            dribbble: ''
        },
        seoMeta: {
            title: 'Stream X: Social Live Streaming Platform - UX Case Study | Rish Designs',
            description: 'A mobile-native streaming platform built to solve the one problem Twitch, YouTube Live and TikTok never solved on mobile: getting the right user to the right stream in seconds.'
        },
        // Modular Section Toggles — set true/false to show/hide
        sections: {
            overview: true,
            problem: true,
            goals: true,
            research: true,
            strategy: true,
            wireframes: true,
            finalDesign: true,
            uxDecisions: true,
            impact: true,
            learnings: true
        },
        // Section Content — fill in data for each enabled section
        sectionContent: {
            overview: {
                title: 'Project Overview',
                text: 'A mobile-native streaming platform built to solve the one problem Twitch, YouTube Live and TikTok never solved on mobile: getting the right user to the right stream in seconds.',
                role: 'Lead UX/UI Designer',
                tools: ['Figma', 'FigJam', 'Maze', 'Notion', 'Lottie'],
                responsibilities: [
                    'User Research',
                    'Strategy',
                    'Information Architecture',
                    'UX Audit',
                    'Wireframes',
                    'Illustration',
                    'UI Design',
                    'Prototyping & Usability Testing'
                ]
            },
            problem: {
                label: 'The Challenge',
                headline: '<span class="highlight">19% of users</span> abandon a streaming session entirely when they can\'t find something to watch.For users aged 18–24, that number jumps to 29% (Source: Nielsen Gracenote, 2025)',
                text: 'Existing platforms were built for desktop and ported to mobile. Not designed for it. Cluttered navigation, no content hierarchy, and zero trust signals meant users left before they ever found a reason to stay. The challenge was to <Strong>design a mobile-native streaming platform</strong> that could take a first-time visitor from zero context to an active live session in under 15 seconds.'
            },
            goals: {
                title: 'Goals',
                categories: [
                    {
                        icon: '\uD83D\uDCCB',
                        title: 'Business Goals',
                        items: [
                            'Increase session depth through layered content discovery',
                            'Create a monetisation surface through native live gifting',
                            'Expand content categories beyond gaming through the IRL, Battles, Science and Radio category architecture on Home',
                            'Maximise content consumption time by keeping users in the app through Recommended streams after their primary session ends'
                        ]
                    },
                    {
                        icon: '\u2764\uFE0F',
                        title: 'User Goals',
                        items: [
                            'Find something worth watching without knowing what that is',
                            'Feel present and social during a live stream, not just a spectator',
                            'Follow creators whose identity is clear from a single profile visit',
                            'Get notified only when something relevant actually happens'
                        ]
                    }
                ]
            },
            research: {
                title: 'Research & Discovery',
                text: 'Analysed 3 competing streaming platforms across three specific dimensions: how quickly a new user reaches a live stream, how creator credibility is established on a zero-reputation platform, and how notification systems drive re-engagement without fatigue. Nielsen Gracenote\'s 2025 State of Play report provided the quantitative anchor, confirming that discovery friction drives the highest abandonment among 18 to 24 year olds. Community research across streaming forums on Reddit and Discord surfaced the qualitative layer: mobile users do not fail because the content is bad. They fail because the path to content is broken.',
                images: [
                    'Assets/CA-STREAMX.webp'
                ],
                layout: 'grid-2'
            },
            strategy: {
                title: 'Strategy',
                items: [
                    {
                        title: 'Discovery Before Intent',
                        text: 'Structured the home feed around categories, live previews and creator cards so users find something worth watching before they know what they are looking for. Every tap goes deeper, never sideways.'
                    },
                    {
                        title: 'Social Presence as a Core Feature',
                        text: 'Built live chat, viewer counts and gifting directly into the stream view rather than treating them as secondary overlays. The social layer is the experience, not an addition to it.'
                    },
                    {
                        title: 'Creator Identity at First Glance',
                        text: 'Designed the profile to answer three questions in under five seconds: who is this person, are they worth following, and what do they make. Stats, verified badge and content tabs do that work instantly.'
                    }
                ]
            },
            wireframes: {
                title: 'Wireframes & Iterations',
                description: 'Iterated through 3 major layout directions for the recording interface and playback experience, testing each with 5 users.',
                images: [
                    'Assets/selectedwork/Wireframes-Showcase.webp'
                ],
                layout: 'grid-2'
            },
            finalDesign: {
                title: 'Final Design',
                description: 'The polished high-fidelity interface with dark mode, clear hierarchy, and immersive audio waveform visualizations.',
                images: [
                    'Assets/Streaming App.webp',
                    'Assets/Stream_X_Second.webp'
                ],
                layout: 'stacked'
            },
            uxDecisions: {
                title: 'Key UX Decisions',
                items: [
                    {
                        title: 'Segmented Notification Tabs',
                        text: 'Splitting notifications into Unread, Following and All mirrors the mental model users already apply manually. Signal is separated from noise at a structural level so every notification feels relevant rather than something to ignore.',
                        image: 'Assets/Segmented.webp'
                    },
                    {
                        title: 'Picture in Picture Host Avatar on Live Stream',
                        text: 'The floating camera feed of the streamer in the bottom corner maintains the parasocial connection that makes live streaming worth watching. It also tells the user instantly that someone is live right now, not a recording.',
                        image: 'Assets/Streamer.webp'
                    },
                    {
                        title: 'Progressive Disclosure',
                        text: 'Stream X never shows everything at once. Information is revealed in layers, matched exactly to how deep a user\'s intent has grown.\nOn the Home screen a user sees categories, two live previews and two creator cards. Enough to orient. Not enough to overwhelm. The moment they tap Games they enter the Sub-Category screen which reveals streamer circles, genre filter pills and an expanded live grid. More signal for a more committed browser. Tap a stream and the full Live view opens with chat, viewer count, gifting and the host avatar. Maximum context at maximum intent.\nThe same principle runs through the Notification screen. Unread sits first because that is the highest intent tab. Following comes next. All is there but never forced on you.\nThe Profile screen does it too. Bio and stats sit at the top for a first-time visitor making a follow decision. Content lives in tabs below so Videos, Audio, Schedule, Podcast and Chat are all accessible but none compete for attention at the same time.\nThe result is an app that feels simple to a first-time user and powerful to an advanced one. Not because there are two modes. Because the interface earns complexity only when the user signals they are ready for it.',
                        image: null
                    }
                ]
            },
            impact: {
                title: 'Impact & Results',
                headline: '',
                text: 'Stream X was a self-initiated product design study treated with the same rigour as a live product. No brief, no team, no shortcuts. Every decision was researched, justified and documented from first principles.',
                highlights: [
                    {
                        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
                        title: 'Research Backed',
                        text: 'Every core design decision validated against two published industry reports and a competitive teardown of 5 platforms.'
                    },
                    {
                        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
                        title: 'End to End Design Process',
                        text: 'Solo execution across research, competitive analysis, UX strategy, information architecture and high-fidelity design.'
                    }
                ]
            },
            learnings: {
                title: 'Key Learnings',
                items: [
                    'When I thought about what actually makes a stream worth staying in, it was never just the video. It was the live chat, the viewer count, the sense that other people were there too. Designing for presence, not just playback, shaped every screen that followed.',
                    'Progressive disclosure taught me to think in layers, not pages. The instinct early on was to show everything at once to feel feature-rich. What worked better was structuring each screen so the first layer invited you in and the next rewarded engagement. The "View all" pattern, profile tabs, and notification grouping are all the same principle at work: show enough to orient, hide the rest until it is needed.',
                    'Building out the notifications screen (Unread, Following, All) made me think harder about how easily trust breaks in a notification feed. The tab structure was not just an organisational choice — it was about giving the user a sense of control over what demands their attention and when.'
                ]
            }
        }
    },
    {
        id: 2,
        title: 'Designing Mobile Experiences',
        slug: 'Designing Mobile Experiences',
        category: 'Mobile',
        type: 'project',
        template: 'project-showcase',
        shortDescription: 'A showcase of high-fidelity mobile interfaces designed with a focus on usability, scalability, and modern product thinking.',
        heroPlaceholderImage: 'Assets/selectedwork/App_thumbnail.webp',
        galleryPlaceholderImages: [
            'Assets/selectedwork/Fitness_App.webp',
            'Assets/selectedwork/F1_App.webp',
            'Assets/selectedwork/Nat_Geo.webp',
            'Assets/selectedwork/Motocross_App.webp'
        ],
        role: 'UX/UI Designer',
        platform: 'iOS, Android',
        timeline: '',
        team: 'Solo project',
        externalLinks: {
            behance: '',
            dribbble: '',
        },
        seoMeta: {
            title: 'Designing Mobile Experiences - Mobile App Design | Rish Designs',
            description: 'A showcase of high-fidelity mobile interfaces designed with a focus on usability, scalability, and modern product thinking.'
        }
    },
    {
        id: 3,
        title: 'Conversion-Focused Landing Pages',
        slug: 'Conversion-Focused Landing Pages',
        category: 'Landing Pages',
        type: 'project',
        template: 'project-showcase',
        shortDescription: 'A collection of landing pages designed with a focus on conversion optimization and user engagement.',
        heroPlaceholderImage: 'Assets/selectedwork/Creator-Network.webp',
        galleryPlaceholderImages: [
            'Assets/Anime.webp',
            'Assets/Creative Studio.webp',
            'Assets/Game-Studio.webp',
            'Assets/Rolls-Royce.webp',
            'Assets/Lunar-Website.webp'
        ],
        role: 'Product Designer',
        platform: 'Web',
        timeline: '',
        team: 'Solo',
        externalLinks: {
            behance: null,
            dribbble: null
        },
        seoMeta: {
            title: 'Crypto Dashboard - Multi-Chain Analytics | Rish Designs',
            description: 'Comprehensive crypto analytics platform for tracking and managing multi-chain digital assets with real-time insights.'
        }
    },
    {
        id: 4,
        title: 'Hero Sections',
        slug: 'Hero Sections',
        category: 'SaaS',
        type: 'project',
        template: 'project-showcase',
        shortDescription: 'A collection of high-impact header explorations for modern web experiences.',
        heroPlaceholderImage: 'Assets/Porsche.webp',
        galleryPlaceholderImages: [
            'Assets/NFT Marketplace Website.webp',
            'Assets/Valorant.webp',
            'Assets/Porsche.webp'
        ],
        role: 'UI/UX Designer',
        platform: 'Web',
        timeline: '',
        team: 'Solo',
        externalLinks: {
            behance: null,
            dribbble: null
        },
        seoMeta: {
            title: 'Food Delivery App - Modern Ordering Platform | Rish Designs',
            description: 'Sleek food delivery app design featuring real-time tracking, personalized recommendations, and seamless checkout experience.'
        }
    },

];

// Helper function to get project by slug
export function getProjectBySlug(slug) {
    return selectedWorkProjects.find(project => project.slug === slug);
}

// Helper function to get all projects with case studies
export function getCaseStudyProjects() {
    return selectedWorkProjects.filter(project => project.type === 'case-study');
}

// Helper function to get all normal projects
export function getNormalProjects() {
    return selectedWorkProjects.filter(project => project.type === 'project');
}
