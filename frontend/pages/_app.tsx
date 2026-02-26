import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <meta name="theme-color" content="#6366f1" />
                <title>TaskMaster Pro</title>
            </Head>
            <div className={inter.className}>
                <AuthProvider>
                    <Component {...pageProps} />
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#1e293b',
                                color: '#f8fafc',
                                borderRadius: '16px',
                                padding: '14px 20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#22c55e',
                                    secondary: '#f8fafc',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#f8fafc',
                                },
                            },
                        }}
                    />
                </AuthProvider>
            </div>
        </>
    );
}
