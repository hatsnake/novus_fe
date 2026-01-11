export const SOCIAL_PROVIDERS = {
    GOOGLE: 'google',
    NAVER: 'naver',
} as const;

export type SocialProvider = typeof SOCIAL_PROVIDERS[keyof typeof SOCIAL_PROVIDERS];