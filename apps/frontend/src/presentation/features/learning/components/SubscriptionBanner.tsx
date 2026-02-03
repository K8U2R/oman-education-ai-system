
import React from 'react';
import { Card, Button } from '@/components/ui';

export const SubscriptionBanner: React.FC<{ tier: string }> = ({ tier }) => {
    if (tier === 'PREMIUM' || tier === 'PRO') return null;

    return (
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex justify-between items-center mb-6">
            <div>
                <h3 className="font-bold text-lg">Unlock your full potential!</h3>
                <p className="text-purple-100">Upgrade to Pro for unlimited AI tutoring and advanced courses.</p>
            </div>
            <Button variant="secondary" className="bg-white text-purple-700 hover:bg-gray-100">
                Upgrade Now
            </Button>
        </Card>
    );
};
