declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_SENDGRID_API_KEY: string;
            NEXT_PUBLIC_SUPABASE_URL: string;
            NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
            NEXT_PUBLIC_URL: string;
            PROD_FEDEX_CLIENT_ID: string;
            PROD_FEDEX_CLIENT_SECRET: string;
        }
    }
}

export {}