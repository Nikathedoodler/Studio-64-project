import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Admin email addresses
const ADMIN_EMAILS = ['admin@studio64.com', 'kakulia.nika@gmail.com'];

export const useAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (user && user.email) {
                    const isAdminUser = ADMIN_EMAILS.includes(
                        user.email.toLowerCase()
                    );
                    setIsAdmin(isAdminUser);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminStatus();
    }, [supabase.auth]);

    return {
        isAdmin,
        isLoading,
    };
};
