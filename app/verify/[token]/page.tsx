"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
    const { token } = useParams();
    const router = useRouter();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await fetch(`/api/auth/verify/${token}`);
                if (res.ok) {
                    router.push("/login?verified=true");
                } else {
                    alert("Verification failed or link expired");
                }
            } catch (error) {
                alert("Something went wrong");
            }
        };

        verifyEmail();
    }, [token, router]);

    return <p>Verifying your email…</p>;
}
