'use client'

import React, { lazy, Suspense } from 'react';
import './alert.css'

const OTPPageContent = lazy(() => import('../../components/otp/Otp'));

function OTPPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OTPPageContent />
        </Suspense>
    );
}

export default OTPPage;
