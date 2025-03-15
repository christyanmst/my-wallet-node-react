import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/apiClient';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import  Router from 'next/router';
import { toast } from 'react-toastify';

type AuthContextData = {
    user?: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SigninProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: number;
    username: string;
    email: string;
}

type SigninProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token');
        toast.success('Deslogado com sucesso');
        Router.push('/');
    } catch {
        toast.error('Erro ao deslogar');
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect(() => {
        const { '@nextauth.token': token } = parseCookies();
        if (token) {
            api.get('/my-profile').then(res => {
                const { id, username, email } = res.data;

                setUser({ id, username, email });
            }).catch(() => {
                signOut();
            })
        }
    }, []);

    async function signIn({ email, password }: SigninProps){
        try {
            const response = await api.post('/login', {
                email,
                password,
            });

            const { id, username, token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 15, // 15 dias
                path: "/"
            });
            
            setUser({ id, username, email });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success('Logado com sucesso');
            Router.push('/dashboard');
        } catch {
            toast.error('Erro ao fazer login');
        }
    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {
            await api.post('/users', {
                name,
                email,
                password, 
            });

            toast.success('Cadastrado com sucesso');
            Router.push('/');
        } catch {
            toast.error('Erro ao cadastrar');
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}