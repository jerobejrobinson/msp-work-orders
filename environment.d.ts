declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_SENDGRID_API_KEY: string;
            NEXT_PUBLIC_SUPABASE_URL: string;
            NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
            NEXT_PUBLIC_URL: string;
            INFOR_API_ci: string;
            INFOR_API_cs: string;
            INFOR_API_pu: string;
            INFOR_API_ot: string;
            INFOR_APR_USER: string;
            INFOR_API_PASS: string;
            INFOR_API_URL: string;
        }
    }
}

export {}