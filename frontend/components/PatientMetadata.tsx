/**
 * Patient Metadata Form Component
 * Captures patient age and lesion location as per research paper requirements
 */

'use client';

import React from 'react';
import { LESION_LOCATIONS, LesionLocation } from '@/lib/types';

interface PatientMetadataProps {
    age: number | null;
    lesionLocation: string;
    onAgeChange: (age: number | null) => void;
    onLesionLocationChange: (location: string) => void;
}

export default function PatientMetadata({
    age,
    lesionLocation,
    onAgeChange,
    onLesionLocationChange,
}: PatientMetadataProps) {
    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            onAgeChange(null);
        } else {
            const numValue = parseInt(value);
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 150) {
                onAgeChange(numValue);
            }
        }
    };

    return (
        <div className="medical-card space-y-4">
            <h3 className="text-lg font-semibold text-medical-text mb-4">
                Patient Information
            </h3>

            {/* Age Input */}
            <div>
                <label htmlFor="age" className="medical-label">
                    Patient Age (Optional)
                </label>
                <input
                    id="age"
                    type="number"
                    min="0"
                    max="150"
                    value={age ?? ''}
                    onChange={handleAgeChange}
                    placeholder="Enter patient age"
                    className="medical-input"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Age range: 0-150 years
                </p>
            </div>

            {/* Lesion Location Dropdown */}
            <div>
                <label htmlFor="lesion-location" className="medical-label">
                    Lesion Location
                </label>
                <select
                    id="lesion-location"
                    value={lesionLocation}
                    onChange={(e) => onLesionLocationChange(e.target.value)}
                    className="medical-input"
                >
                    <option value="">Select location</option>
                    {LESION_LOCATIONS.map((location) => (
                        <option key={location} value={location}>
                            {location}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                    Select the body location of the lesion
                </p>
            </div>
        </div>
    );
}
