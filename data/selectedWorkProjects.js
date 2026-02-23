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
        title: 'Call Recording App',
        slug: 'call-recording-app',
        category: 'Mobile',
        type: 'case-study', // 'case-study' or 'project'
        template: 'case-study-default', // Template HTML file to use
        shortDescription: 'Intelligent call recording and transcription app with AI-powered insights.',
        heroPlaceholderImage: 'Assets/Call%20recording%20app%20Rish%20Designs.png',
        galleryPlaceholderImages: [
            'Assets/Call%20recording%20app%20Rish%20Designs.png',
            'Assets/Call%20recording%20app%20Rish%20Designs.png',
            'Assets/Call%20recording%20app%20Rish%20Designs.png'
        ],
        role: 'Lead UX/UI Designer',
        platform: 'iOS, Android',
        timeline: '3 months',
        team: '1 Designer, 2 Developers, 1 PM',
        externalLinks: {
            behance: 'https://www.behance.net/gallery/call-recording-app', // Sample Behance link
            dribbble: 'https://www.behance.net/gallery/call-recording-app'
        },
        seoMeta: {
            title: 'Call Recording App - UX Case Study | Rish Designs',
            description: 'Deep dive into designing an intelligent call recording app with AI-powered transcription and insights for iOS and Android.'
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
                text: 'Designed a seamless mobile experience for professionals to record, transcribe, and extract insights from their phone conversations.',
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
                headline: 'Professionals were spending <span class="highlight">3+ hours per week</span> manually reviewing call recordings across fragmented tools.',
                text: 'Existing solutions were clunky and unreliable \u2014 complicated onboarding, poor transcription quality, and zero intelligent organization. <strong>78% of users</strong> abandoned recording apps within the first week due to friction. Our challenge was to build an always-ready, intelligent recording tool that could transcribe and surface key moments automatically.'
            },
            goals: {
                title: 'Goals',
                categories: [
                    {
                        icon: '\uD83D\uDCCB',
                        title: 'Business Goals',
                        items: [
                            'Achieve 90%+ transcription accuracy',
                            'Reduce time-to-insight by 60%',
                            'Increase user retention past first week',
                            'Build a searchable archive as accessible as email'
                        ]
                    },
                    {
                        icon: '\u2764\uFE0F',
                        title: 'User Goals',
                        items: [
                            'One-tap recording from any screen',
                            'Instant searchable transcripts',
                            'Smart tagging of action items',
                            'Effortless sharing of key moments'
                        ]
                    }
                ]
            },
            research: {
                title: 'Research & Discovery',
                text: 'Conducted 15 in-depth user interviews with sales professionals, consultants, and journalists to understand their call workflows. Ran a competitive analysis of 8 existing recording apps, identifying common UX pitfalls: complicated onboarding, poor transcription quality, and lack of intelligent organization. Survey data from 200+ respondents confirmed that 78% of users abandon recording apps within the first week due to friction.',
                images: [
                    'Assets/Liquid%20Glass%20UI%20Rish%20Designs.png',
                    'Assets/Call%20recording%20app%20Rish%20Designs.png'
                ],
                layout: 'grid-2'
            },
            strategy: {
                title: 'Strategy',
                items: [
                    {
                        title: 'Simplify Recording',
                        text: 'Reduced the recording flow from 3 steps to a single tap. A persistent, minimal recording widget stays accessible across all screens without disrupting workflow.'
                    },
                    {
                        title: 'AI-First Transcription',
                        text: 'Built the core experience around automatic transcription with smart tagging. Action items, decisions, and follow-ups are surfaced within seconds of a call ending.'
                    },
                    {
                        title: 'Searchable Archive',
                        text: 'Transformed static recordings into a searchable, taggable knowledge base. Users can find any conversation moment as easily as searching email.'
                    }
                ]
            },
            wireframes: {
                title: 'Wireframes & Iterations',
                description: 'Iterated through 3 major layout directions for the recording interface and playback experience, testing each with 5 users.',
                images: [
                    'Assets/Call%20recording%20app%20Rish%20Designs.png',
                    'Assets/Call%20recording%20app%20Rish%20Designs.png'
                ],
                layout: 'grid-2'
            },
            finalDesign: {
                title: 'Final Design',
                description: 'The polished high-fidelity interface with dark mode, clear hierarchy, and immersive audio waveform visualizations.',
                images: [
                    'Assets/Call%20recording%20app%20Rish%20Designs.png',
                    'Assets/Call%20recording%20app%20Rish%20Designs.png',
                    'Assets/Call%20recording%20app%20Rish%20Designs.png'
                ],
                layout: 'stacked'
            },
            uxDecisions: {
                title: 'Key UX Decisions',
                items: [
                    {
                        title: 'One-Tap Recording',
                        text: 'Reduced recording initiation to a single tap from the home screen. Eliminated the 3-step flow from competitors that caused users to miss the start of conversations.',
                        image: 'Assets/Call%20recording%20app%20Rish%20Designs.png'
                    },
                    {
                        title: 'AI-Powered Smart Tags',
                        text: 'Implemented automatic tagging of action items, decisions, and follow-ups within transcripts. This reduced review time from 15 minutes to under 3 minutes per call.',
                        image: 'Assets/Call%20recording%20app%20Rish%20Designs.png'
                    },
                    {
                        title: 'Progressive Disclosure',
                        text: 'The playback screen initially shows a clean waveform and transcript. Advanced features (export, share, edit tags) are revealed contextually to avoid overwhelming new users.',
                        image: null
                    }
                ]
            },
            impact: {
                title: 'Impact & Results',
                text: 'The redesigned app saw significant improvements across all key metrics within the first 3 months of launch, validating the research-driven design approach.',
                metrics: [
                    { value: '92%', label: 'Transcription Accuracy' },
                    { value: '4.7', label: 'App Store Rating' },
                    { value: '10K+', label: 'Monthly Active Users' }
                ],
                testimonial: {
                    quote: 'This app has transformed how I handle client calls. The transcription is incredibly accurate and the smart tags save me hours every week.',
                    author: 'Sarah M., Business Consultant'
                }
            },
            learnings: {
                title: 'Key Learnings',
                items: [
                    'Early prototyping with real audio data was critical \u2014 synthetic test data hid transcription UX issues that only surfaced with real conversations.',
                    'Users strongly preferred progressive disclosure over feature-rich dashboards. Simplicity won over power-user features in every round of testing.',
                    'The biggest retention driver was not recording quality, but the AI-powered review experience \u2014 making past calls searchable was the killer feature.'
                ]
            }
        }
    },
    {
        id: 2,
        title: 'Christmas UI',
        slug: 'christmas-ui',
        category: 'Landing Pages',
        type: 'project',
        template: 'project-showcase',
        shortDescription: 'Festive 3D interactive landing page with immersive holiday animations.',
        heroPlaceholderImage: 'https://i.ibb.co/kVTJCCGC/Scene.gif',
        galleryPlaceholderImages: [
            'https://i.ibb.co/kVTJCCGC/Scene.gif',
            'https://i.ibb.co/kVTJCCGC/Scene.gif',
            'https://i.ibb.co/kVTJCCGC/Scene.gif',
            'https://i.ibb.co/kVTJCCGC/Scene.gif'
        ],
        role: 'UI Designer & Developer',
        platform: 'Web',
        timeline: '2 weeks',
        team: 'Solo project',
        externalLinks: {
            behance: 'https://www.behance.net/gallery/call-recording-app',
            dribbble: 'https://www.behance.net/gallery/call-recording-app',
        },
        seoMeta: {
            title: 'Christmas UI - Festive Landing Page Design | Rish Designs',
            description: 'Interactive 3D Christmas-themed landing page with immersive animations and festive design elements.'
        }
    },
    {
        id: 3,
        title: 'Crypto Dashboard',
        slug: 'crypto-dashboard',
        category: 'SaaS',
        type: 'project',
        template: 'project-showcase',
        shortDescription: 'Financial analytics platform for tracking multi-chain crypto assets.',
        heroPlaceholderImage: 'Assets/Crypto%20UI%20Rish%20Designs.png',
        galleryPlaceholderImages: [
            'Assets/Crypto%20UI%20Rish%20Designs.png',
            'Assets/Crypto%20UI%20Rish%20Designs.png',
            'Assets/Crypto%20UI%20Rish%20Designs.png',
            'Assets/Crypto%20UI%20Rish%20Designs.png',
            'Assets/Crypto%20UI%20Rish%20Designs.png'
        ],
        role: 'Product Designer',
        platform: 'Web App',
        timeline: '4 months',
        team: '2 Designers, 3 Developers',
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
        title: 'Fitness Tracking App',
        slug: 'fitness-tracking-app',
        category: 'Mobile',
        type: 'case-study',
        template: 'case-study-default',
        shortDescription: 'Personal carbon footprint tracker with gamified wellness features.',
        heroPlaceholderImage: 'Assets/Fitness%20app%20UI.png',
        galleryPlaceholderImages: [
            'Assets/Fitness%20app%20UI.png',
            'Assets/Fitness%20app%20UI.png',
            'Assets/Fitness%20app%20UI.png'
        ],
        role: 'UX/UI Designer',
        platform: 'iOS, Android',
        timeline: '2.5 months',
        team: 'Solo designer + 2 developers',
        externalLinks: {
            behance: '#',
            dribbble: null
        },
        seoMeta: {
            title: 'Fitness Tracking App - Gamified Wellness | Rish Designs',
            description: 'Mobile fitness app case study featuring gamification, carbon footprint tracking, and personalized wellness insights.'
        },
        sections: {
            overview: true,
            problem: true,
            goals: true,
            research: false,
            strategy: false,
            wireframes: false,
            finalDesign: true,
            uxDecisions: false,
            impact: true,
            learnings: true
        },
        sectionContent: {
            overview: {
                title: 'Project Overview',
                text: 'Fitness Track is an app that helps users track their physical activity while rewarding them for making sustainable travel choices.',
                role: 'UX/UI Designer',
                tools: ['Figma', 'Miro', 'Principle'],
                responsibilities: [
                    'User Research',
                    'Wireframes',
                    'UI Design',
                    'Prototyping',
                    'Usability Testing'
                ]
            },
            problem: {
                label: 'The Challenge',
                headline: 'Most fitness apps focus purely on exercise metrics while ignoring the <span class="highlight">environmental impact</span> of daily travel choices.',
                text: 'Users lacked a holistic view connecting their physical activity with sustainable habits, leading to lower motivation and engagement. Our challenge was to create a unified experience that bridges fitness tracking and environmental awareness.'
            },
            goals: {
                title: 'Goals',
                categories: [
                    {
                        icon: '\uD83C\uDFAF',
                        title: 'Business Goals',
                        items: [
                            'Achieve 60%+ 7-day retention',
                            'Differentiate from pure fitness apps',
                            'Drive organic growth through social features'
                        ]
                    },
                    {
                        icon: '\uD83C\uDF31',
                        title: 'User Goals',
                        items: [
                            'Unified fitness + sustainability tracking',
                            'Motivating reward mechanics',
                            'Simple interface during workouts'
                        ]
                    }
                ]
            },
            finalDesign: {
                title: 'Final Design',
                description: 'Vibrant, motivating visuals designed for clarity during workouts.',
                images: [
                    'Assets/Fitness%20app%20UI.png',
                    'Assets/Fitness%20app%20UI.png'
                ],
                layout: 'grid-2'
            },
            impact: {
                title: 'Impact & Results',
                text: 'The gamified approach to combining fitness with environmental awareness resonated strongly with the target audience.',
                metrics: [
                    { value: '65%', label: '7-Day Retention' },
                    { value: '4.3', label: 'Average Rating' },
                    { value: '8K', label: 'Active Users' }
                ],
                testimonial: {
                    quote: 'Finally a fitness app that makes me want to walk more and actually shows my environmental impact!',
                    author: 'Mike R., Early Adopter'
                }
            },
            learnings: {
                title: 'Key Learnings',
                items: [
                    'Gamification mechanics need to be carefully balanced \u2014 too many rewards dilute their motivational impact.',
                    'Users preferred simple progress visuals over complex data dashboards during active workout sessions.'
                ]
            }
        }
    },
    {
        id: 5,
        title: 'Food Delivery App',
        slug: 'food-delivery-app',
        category: 'Mobile',
        type: 'project',
        template: 'project-showcase',
        shortDescription: 'Modern food delivery platform with real-time tracking and ordering.',
        heroPlaceholderImage: 'Assets/Food%20app%20ui%20Rish%20Designs.png',
        galleryPlaceholderImages: [
            'Assets/Food%20app%20ui%20Rish%20Designs.png',
            'Assets/Food%20app%20ui%20Rish%20Designs.png',
            'Assets/Food%20app%20ui%20Rish%20Designs.png'
        ],
        role: 'UI/UX Designer',
        platform: 'iOS, Android',
        timeline: '3 months',
        team: '1 Designer, 4 Developers, 1 PM',
        externalLinks: {
            behance: null,
            dribbble: null
        },
        seoMeta: {
            title: 'Food Delivery App - Modern Ordering Platform | Rish Designs',
            description: 'Sleek food delivery app design featuring real-time tracking, personalized recommendations, and seamless checkout experience.'
        }
    },
    {
        id: 6,
        title: 'Glassmorphism Landing',
        slug: 'glassmorphism-landing',
        category: 'Landing Pages',
        type: 'project',
        template: 'project-showcase',
        shortDescription: 'Premium landing page showcasing modern glassmorphic design trends.',
        heroPlaceholderImage: 'Assets/Glassmorphism%20Landing%20Page%20Rish%20Designs.png',
        galleryPlaceholderImages: [
            'Assets/Glassmorphism%20Landing%20Page%20Rish%20Designs.png',
            'Assets/Glassmorphism%20Landing%20Page%20Rish%20Designs.png',
            'Assets/Glassmorphism%20Landing%20Page%20Rish%20Designs.png'
        ],
        role: 'UI Designer & Frontend Developer',
        platform: 'Web',
        timeline: '3 weeks',
        team: 'Solo project',
        externalLinks: {
            behance: null,
            dribbble: null
        },
        seoMeta: {
            title: 'Glassmorphism Landing Page - Premium Design | Rish Designs',
            description: 'Modern landing page showcasing glassmorphism design trends with blur effects, transparency, and premium animations.'
        }
    },
    {
        id: 7,
        title: 'Liquid Glass SaaS',
        slug: 'liquid-glass-saas',
        category: 'SaaS',
        type: 'project',
        template: 'project-showcase',
        shortDescription: 'Enterprise SaaS platform with advanced workflow automation features.',
        heroPlaceholderImage: 'Assets/Liquid%20Glass%20UI%20Rish%20Designs.png',
        galleryPlaceholderImages: [
            'Assets/Liquid%20Glass%20UI%20Rish%20Designs.png',
            'Assets/Liquid%20Glass%20UI%20Rish%20Designs.png',
            'Assets/Liquid%20Glass%20UI%20Rish%20Designs.png'
        ],
        role: 'Lead Product Designer',
        platform: 'Web App',
        timeline: '6 months',
        team: '3 Designers, 5 Developers, 1 PM',
        externalLinks: {
            behance: null,
            dribbble: null
        },
        seoMeta: {
            title: 'Liquid Glass SaaS - Enterprise Platform | Rish Designs',
            description: 'Enterprise-grade SaaS platform design with advanced workflow automation, team collaboration, and analytics features.'
        }
    },
    {
        id: 8,
        title: 'Podcast Player App',
        slug: 'podcast-player-app',
        category: 'Mobile',
        type: 'project',
        template: 'project-showcase',
        shortDescription: 'Minimalist podcast player with smart playlists and offline downloads.',
        heroPlaceholderImage: 'Assets/Podcast%20app.png',
        galleryPlaceholderImages: [
            'Assets/Podcast%20app.png',
            'Assets/Podcast%20app.png',
            'Assets/Podcast%20app.png'
        ],
        role: 'UI/UX Designer',
        platform: 'iOS',
        timeline: '2 months',
        team: 'Solo designer + 1 developer',
        externalLinks: {
            behance: null,
            dribbble: null
        },
        seoMeta: {
            title: 'Podcast Player App - Minimalist Design | Rish Designs',
            description: 'Clean, minimalist podcast player app with smart playlists, offline downloads, and personalized discovery features.'
        }
    },
    {
        id: 9,
        title: 'NFT Marketplace',
        slug: 'nft-marketplace',
        category: 'SaaS',
        type: 'project',
        template: 'project-showcase',
        shortDescription: 'Next-gen NFT marketplace with advanced analytics and social features.',
        heroPlaceholderImage: 'Assets/NFT%20Web%20app.png',
        galleryPlaceholderImages: [
            'Assets/NFT%20Web%20app.png',
            'Assets/NFT%20Web%20app.png',
            'Assets/NFT%20Web%20app.png'
        ],
        role: 'Product Designer',
        platform: 'Web3',
        timeline: '4 months',
        team: '2 Designers, 4 Developers, 1 PM',
        externalLinks: {
            behance: null,
            dribbble: null
        },
        seoMeta: {
            title: 'NFT Marketplace - Web3 Platform | Rish Designs',
            description: 'Next-generation NFT trading platform with advanced analytics, social features, and seamless Web3 integration.'
        }
    }
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
