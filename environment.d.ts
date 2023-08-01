declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_SENDGRID_API_KEY: string;
            NEXT_PUBLIC_SUPABASE_URL: string;
            NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
            NEXT_PUBLIC_URL: string;
        }
    }
}

export {}