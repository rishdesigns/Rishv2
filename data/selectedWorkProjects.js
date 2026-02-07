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
            dribbble: null
        },
        seoMeta: {
            title: 'Call Recording App - UX Case Study | Rish Designs',
            description: 'Deep dive into designing an intelligent call recording app with AI-powered transcription and insights for iOS and Android.'
        },
        // NEW: Modular Section Toggles
        sections: {
            overview: true,
            competitiveAnalysis: true,
            userFlow: true,
            wireframes: true,
            highFidelity: true,
            outcomes: true
        },
        // NEW: Image-First Section Content
        sectionContent: {
            overview: {
                title: 'Overview',
                text: 'Designed a seamless mobile experience for professionals to record, transcribe, and extract insights from their phone conversations.',
                images: ['Assets/Call%20recording%20app%20Rish%20Designs.png'],
                layout: 'stacked'
            },
            competitiveAnalysis: {
                title: 'Competitive Analysis',
                description: 'Analyzing existing solutions to identify gaps in transcription accuracy and user experience.',
                images: ['Assets/Call%20recording%20app%20Rish%20Designs.png'],
                layout: 'full-width'
            },
            userFlow: {
                title: 'User Flow',
                description: 'A streamlined architecture ensuring recording is always one tap away.',
                images: ['Assets/Call%20recording%20app%20Rish%20Designs.png'],
                layout: 'full-width'
            },
            wireframes: {
                title: 'Wireframes',
                description: 'Iterating through layouts to find the most intuitive playback experience.',
                images: [
                    'Assets/Call%20recording%20app%20Rish%20Designs.png',
                    'Assets/Call%20recording%20app%20Rish%20Designs.png'
                ],
                layout: 'grid-2'
            },
            highFidelity: {
                title: 'High-Fidelity Designs',
                description: 'Final immersive visuals with dark mode support and clear information hierarchy.',
                images: [
                    'Assets/Call%20recording%20app%20Rish%20Designs.png',
                    'Assets/Call%20recording%20app%20Rish%20Designs.png',
                    'Assets/Call%20recording%20app%20Rish%20Designs.png'
                ],
                layout: 'stacked'
            },
            outcomes: {
                title: 'Outcomes',
                metrics: [
                    { value: '92%', label: 'Transcription Accuracy' },
                    { value: '4.7', label: 'App Store Rating' },
                    { value: '10K+', label: 'Monthly Active Users' }
                ],
                testimonial: {
                    quote: 'This app has transformed how I handle client calls. The transcription is incredibly accurate.',
                    author: 'Sarah M., Business Consultant'
                }
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
            behance: null,
            dribbble: null
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
            competitiveAnalysis: false,
            userFlow: true,
            wireframes: false,
            highFidelity: true,
            outcomes: true
        },
        sectionContent: {
            overview: {
                title: 'Project Overview',
                text: 'Fitness Track is an app that helps users track their physical activity while rewarding them for making sustainable travel choices.',
                images: ['Assets/Fitness%20app%20UI.png'],
                layout: 'constrained'
            },
            userFlow: {
                title: 'Streamlined Experience',
                description: 'Intuitive navigation paths for logging activities and monitoring progress.',
                images: ['Assets/Fitness%20app%20UI.png'],
                layout: 'full-width'
            },
            highFidelity: {
                title: 'High-Fidelity Interface',
                description: 'Vibrant, motivating visuals designed for clarity during workouts.',
                images: [
                    'Assets/Fitness%20app%20UI.png',
                    'Assets/Fitness%20app%20UI.png'
                ],
                layout: 'grid-2'
            },
            outcomes: {
                title: 'The Result',
                metrics: [
                    { value: '65%', label: '7-Day Retention' },
                    { value: '4.3', label: 'Average Rating' },
                    { value: '8K', label: 'Active Users' }
                ],
                testimonial: {
                    quote: 'Finally a fitness app that makes me want to walk more and actually shows my environmental impact!',
                    author: 'Mike R., Early Adopter'
                }
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
