/**
 * Main Application Page
 * Medical Diagnosis System with Research Paper Features
 */

'use client';

import React, { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import PatientMetadata from '@/components/PatientMetadata';
import ClinicalDetails from '@/components/ClinicalDetails';
import TriageWarning from '@/components/TriageWarning';
import LoadingSpinner from '@/components/LoadingSpinner';
import ReportDownload from '@/components/ReportDownload';
import { predictDisease } from '@/lib/api';
import { PredictionResponse } from '@/lib/types';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [lesionLocation, setLesionLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      setError('Please upload an image first');
      return;
    }

    if (!lesionLocation) {
      setError('Please select a lesion location');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await predictDisease(selectedImage, age ?? undefined, lesionLocation);
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAge(null);
    setLesionLocation('');
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-medical-background">
      {/* Header */}
      <header className="bg-medical-surface border-b border-medical-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-medical-primary rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-medical-text">
                Skin Disease Diagnosis System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                AI-powered diagnosis with EfficientNetB0 • Research Paper Implementation
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
            />

            <PatientMetadata
              age={age}
              lesionLocation={lesionLocation}
              onAgeChange={setAge}
              onLesionLocationChange={setLesionLocation}
            />

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePredict}
                disabled={!selectedImage || !lesionLocation || isLoading}
                className="flex-1 medical-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Image'}
              </button>
              {prediction && (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Error: {error}</p>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {isLoading && <LoadingSpinner />}

            {prediction && !isLoading && (
              <>
                {/* Triage Warning */}
                <TriageWarning
                  triage={prediction.triage}
                  predictedClass={prediction.predicted_class}
                />

                {/* Clinical Details */}
                <ClinicalDetails
                  predictedClass={prediction.predicted_class}
                  confidence={prediction.confidence}
                  classProbabilities={prediction.class_probabilities}
                  clinicalDetails={prediction.clinical_details}
                />

                {/* Model Information */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-md p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Model Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Model Type:</span>
                      <span className="font-medium">{prediction.model_info.model_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Input Shape:</span>
                      <span className="font-medium">{prediction.model_info.input_shape}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Preprocessing:</span>
                      <span className="font-medium">{prediction.model_info.preprocessing}</span>
                    </div>
                    {prediction.patient_metadata.age && (
                      <div className="flex justify-between">
                        <span>Patient Age:</span>
                        <span className="font-medium">{prediction.patient_metadata.age} years</span>
                      </div>
                    )}
                    {prediction.patient_metadata.lesion_location && (
                      <div className="flex justify-between">
                        <span>Lesion Location:</span>
                        <span className="font-medium">{prediction.patient_metadata.lesion_location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Report Button */}
                <ReportDownload
                  result={prediction}
                  patientAge={age ?? undefined}
                  lesionLocation={lesionLocation}
                  uploadedImage={imagePreview ?? undefined}
                />
              </>
            )}

            {/* Initial State */}
            {!prediction && !isLoading && (
              <div className="bg-white border border-slate-200 rounded-lg shadow-md p-6 text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Ready for Analysis
                </h3>
                <p className="text-sm text-gray-600">
                  Upload an image and provide patient information to begin diagnosis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-bold text-yellow-900 mb-1">
                Medical Disclaimer
              </h4>
              <p className="text-sm text-yellow-800">
                <strong>The AI serves to flag high-risk cases; ultimate accountability remains with the clinician.</strong>
                {' '}This system is designed to assist healthcare professionals in identifying potential skin conditions.
                It should not be used as a substitute for professional medical advice, diagnosis, or treatment.
                Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-medical-surface border-t border-medical-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            © 2026 Skin Disease Diagnosis System • Research Paper Implementation •
            EfficientNetB0 with Human-in-the-Loop Triage
          </p>
        </div>
      </footer>
    </div>
  );
}
