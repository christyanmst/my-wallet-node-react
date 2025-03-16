import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export function canSSRGuest<P extends { [key: string]: unknown }>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        const token = cookies['@nextauth.token'];

        if (token) {
            return { 
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }
        return await fn(ctx);
    }
}
