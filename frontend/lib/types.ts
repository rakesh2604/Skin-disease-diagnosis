/**
 * TypeScript type definitions for the medical diagnosis system
 */

export interface PredictionRequest {
    file: File;
    age?: number;
    lesion_location?: string;
}

export interface ClinicalDetails {
    name: string;
    definition: string;
    characteristics: string[];
    severity: string;
}

export interface TriageInfo {
    level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    message: string;
    requires_immediate_attention: boolean;
    melanoma_probability: number;
}

export interface PatientMetadata {
    age: number | null;
    lesion_location: string | null;
}

export interface ModelInfo {
    model_type: string;
    input_shape: string;
    preprocessing: string;
    using_placeholder: string;
}

export interface PredictionResponse {
    predicted_class: string;
    confidence: number;
    class_probabilities: {
        [key: string]: number;
    };
    clinical_details: ClinicalDetails;
    triage: TriageInfo;
    patient_metadata: PatientMetadata;
    model_info: ModelInfo;
}

export const LESION_LOCATIONS = [
    'Face',
    'Chest',
    'Back',
    'Arms',
    'Legs',
    'Hands',
    'Feet',
    'Scalp',
    'Neck',
    'Other'
] as const;

export type LesionLocation = typeof LESION_LOCATIONS[number];
