/**
 * API client for the medical diagnosis backend
 * Enhanced with timeout handling and retry logic
 */

import { PredictionResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://skin-disease-diagnosis-k574.onrender.com';
const API_TIMEOUT = 60000; // 60 seconds for predictions
const HEALTH_TIMEOUT = 5000; // 5 seconds for health checks
const MAX_RETRIES = 2; // Reduced from 3 to speed up failures

async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = API_TIMEOUT
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - the server took too long to respond. Please try again.');
        }
        throw error;
    }
}

export async function predictDisease(
    file: File,
    age?: number,
    lesionLocation?: string,
    retryCount: number = 0
): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    if (age !== undefined && age !== null) {
        formData.append('age', age.toString());
    }

    if (lesionLocation) {
        formData.append('lesion_location', lesionLocation);
    }

    try {
        const response = await fetchWithTimeout(`${API_URL}/predict`, {
            method: 'POST',
            body: formData,
        }, API_TIMEOUT); // Explicitly use API_TIMEOUT

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Unknown error' }));

            // Handle specific error codes
            if (response.status === 413) {
                throw new Error('File too large. Maximum size is 10MB.');
            } else if (response.status === 400) {
                throw new Error(error.detail || 'Invalid image file. Please upload a clear JPEG or PNG image.');
            } else if (response.status === 429) {
                throw new Error('Too many requests. Please wait a moment and try again.');
            } else {
                throw new Error(error.detail || 'Prediction failed. Please try again.');
            }
        }

        return response.json();
    } catch (error: any) {
        // Retry logic for network errors
        if (retryCount < MAX_RETRIES && (
            error.message.includes('network') ||
            error.message.includes('fetch') ||
            error.message.includes('timeout')
        )) {
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            return predictDisease(file, age, lesionLocation, retryCount + 1);
        }
        throw error;
    }
}

export async function checkHealth(): Promise<any> {
    try {
        const response = await fetchWithTimeout(
            `${API_URL}/health`,
            { method: 'GET' },
            HEALTH_TIMEOUT // 5 second timeout for health checks
        );

        if (!response.ok) {
            throw new Error(`Health check failed: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Health check error:', error);
        throw error;
    }
}
