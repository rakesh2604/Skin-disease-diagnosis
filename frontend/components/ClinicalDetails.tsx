/**
 * Clinical Details Card Component
 * Displays disease prediction with clinical definitions from research paper
 */

'use client';

import React from 'react';
import { ClinicalDetails as ClinicalDetailsType } from '@/lib/types';

interface ClinicalDetailsProps {
    predictedClass: string;
    confidence: number;
    classProbabilities: { [key: string]: number };
    clinicalDetails: ClinicalDetailsType;
}

export default function ClinicalDetails({
    predictedClass,
    confidence,
    classProbabilities,
    clinicalDetails,
}: ClinicalDetailsProps) {
    return (
        <div className="medical-card space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-medical-text mb-2">
                    Diagnosis Result
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-medical-primary">
                        {predictedClass}
                    </span>
                    <span className="text-lg text-gray-600">
                        ({(confidence * 100).toFixed(1)}% confidence)
                    </span>
                </div>
            </div>

            {/* Confidence Score Bar */}
            <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Confidence Score</span>
                    <span className="font-semibold">{(confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-medical-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${confidence * 100}%` }}
                    />
                </div>
            </div>

            {/* Clinical Definition from Research Paper */}
            <div className="border-t border-medical-border pt-4">
                <h4 className="text-lg font-semibold text-medical-text mb-3">
                    Clinical Details
                </h4>

                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Definition:</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {clinicalDetails.definition}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Characteristics:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {clinicalDetails.characteristics.map((char, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                    {char}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <span className="text-sm font-medium text-gray-700">Severity:</span>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${clinicalDetails.severity.includes('Critical')
                                ? 'bg-red-100 text-red-800'
                                : clinicalDetails.severity.includes('Moderate')
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : clinicalDetails.severity.includes('Benign')
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                            }`}>
                            {clinicalDetails.severity}
                        </span>
                    </div>
                </div>
            </div>

            {/* Class Probabilities */}
            <div className="border-t border-medical-border pt-4">
                <h4 className="text-lg font-semibold text-medical-text mb-3">
                    All Class Probabilities
                </h4>
                <div className="space-y-2">
                    {Object.entries(classProbabilities)
                        .sort(([, a], [, b]) => b - a)
                        .map(([className, probability]) => (
                            <div key={className} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 w-32">
                                    {className}
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${className === predictedClass
                                                ? 'bg-medical-primary'
                                                : 'bg-gray-400'
                                            }`}
                                        style={{ width: `${probability * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-16 text-right">
                                    {(probability * 100).toFixed(1)}%
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
