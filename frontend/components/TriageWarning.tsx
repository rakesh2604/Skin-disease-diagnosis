/**
 * Triage Warning Component
 * Implements human-in-the-loop alert system for melanoma detection
 */

'use client';

import React from 'react';
import { TriageInfo } from '@/lib/types';

interface TriageWarningProps {
    triage: TriageInfo;
    predictedClass: string;
}

export default function TriageWarning({ triage, predictedClass }: TriageWarningProps) {
    // Determine alert styling based on triage level
    const getAlertStyles = () => {
        switch (triage.level) {
            case 'CRITICAL':
                return {
                    container: 'bg-red-50 border-red-600',
                    icon: 'text-red-600',
                    title: 'text-red-900',
                    message: 'text-red-800',
                };
            case 'HIGH':
                return {
                    container: 'bg-orange-50 border-orange-500',
                    icon: 'text-orange-500',
                    title: 'text-orange-900',
                    message: 'text-orange-800',
                };
            case 'MEDIUM':
                return {
                    container: 'bg-yellow-50 border-yellow-500',
                    icon: 'text-yellow-600',
                    title: 'text-yellow-900',
                    message: 'text-yellow-800',
                };
            case 'LOW':
                return {
                    container: 'bg-green-50 border-green-500',
                    icon: 'text-green-600',
                    title: 'text-green-900',
                    message: 'text-green-800',
                };
            default:
                return {
                    container: 'bg-gray-50 border-gray-500',
                    icon: 'text-gray-600',
                    title: 'text-gray-900',
                    message: 'text-gray-800',
                };
        }
    };

    const styles = getAlertStyles();

    return (
        <div className={`border-l-4 ${styles.container} p-6 rounded-r-lg shadow-md`}>
            <div className="flex items-start gap-4">
                {/* Alert Icon */}
                <div className={`flex-shrink-0 ${styles.icon}`}>
                    {triage.level === 'CRITICAL' || triage.level === 'HIGH' ? (
                        <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </div>

                {/* Alert Content */}
                <div className="flex-1">
                    <h3 className={`text-lg font-bold ${styles.title} mb-2`}>
                        {triage.level === 'CRITICAL' && '🚨 URGENT: Immediate Human Review Required'}
                        {triage.level === 'HIGH' && '⚠️ High Priority Alert'}
                        {triage.level === 'MEDIUM' && 'ℹ️ Moderate Priority'}
                        {triage.level === 'LOW' && '✓ Low Priority'}
                    </h3>

                    <p className={`${styles.message} font-medium mb-3`}>
                        {triage.message}
                    </p>

                    {/* Melanoma-specific warning */}
                    {(triage.level === 'CRITICAL' || triage.level === 'HIGH') && (
                        <div className="bg-white bg-opacity-50 rounded-lg p-4 mt-3">
                            <p className="text-sm font-semibold text-red-900 mb-2">
                                Human-in-the-Loop Protocol:
                            </p>
                            <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                                <li>Melanoma probability: {(triage.melanoma_probability * 100).toFixed(1)}%</li>
                                <li>Immediate dermatologist consultation recommended</li>
                                <li>Consider biopsy for definitive diagnosis</li>
                                <li>Do not delay professional medical evaluation</li>
                            </ul>
                        </div>
                    )}

                    {/* Triage Level Badge */}
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">Triage Level:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${triage.level === 'CRITICAL' ? 'bg-red-600 text-white' :
                                triage.level === 'HIGH' ? 'bg-orange-500 text-white' :
                                    triage.level === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                                        'bg-green-500 text-white'
                            }`}>
                            {triage.level}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
