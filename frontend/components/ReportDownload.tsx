/**
 * PDF Report Generator
 * Generates downloadable PDF report of diagnosis results using jsPDF
 */

'use client';

import React from 'react';
import { PredictionResponse } from '@/lib/types';
import { jsPDF } from 'jspdf';

interface ReportDownloadProps {
    result: PredictionResponse;
    patientAge?: number;
    lesionLocation?: string;
    uploadedImage?: string;
}

export default function ReportDownload({ result, patientAge, lesionLocation, uploadedImage }: ReportDownloadProps) {

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 20;

        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Helper function to add text with word wrap
        const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
            doc.setFontSize(fontSize);
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y);
            return y + (lines.length * fontSize * 0.5);
        };

        // Header
        doc.setFillColor(8, 145, 178); // Medical primary color
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Skin Disease Diagnosis Report', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('AI-Powered Medical Analysis System', pageWidth / 2, 30, { align: 'center' });

        yPos = 50;
        doc.setTextColor(0, 0, 0);

        // Report Date
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Report Generated: ${date}`, pageWidth - 15, yPos, { align: 'right' });
        yPos += 15;

        // Patient Information Section
        doc.setFillColor(240, 240, 240);
        doc.rect(15, yPos, pageWidth - 30, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(8, 145, 178);
        doc.text('Patient Information', 20, yPos + 6);
        yPos += 15;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Age: ${patientAge ? `${patientAge} years` : 'Not provided'}`, 20, yPos);
        yPos += 7;
        doc.text(`Lesion Location: ${lesionLocation || 'Not provided'}`, 20, yPos);
        yPos += 7;
        doc.text(`Analysis Date: ${date}`, 20, yPos);
        yPos += 15;

        // Diagnosis Result Section
        doc.setFillColor(224, 242, 254);
        doc.rect(15, yPos, pageWidth - 30, 30, 'F');
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(8, 145, 178);
        doc.text('Diagnosis Result', 20, yPos + 8);
        yPos += 15;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Predicted Condition: ${result.predicted_class}`, 20, yPos);
        yPos += 8;
        doc.text(`Confidence Level: ${(result.confidence * 100).toFixed(1)}%`, 20, yPos);
        yPos += 20;

        // Class Probabilities
        doc.setFillColor(240, 240, 240);
        doc.rect(15, yPos, pageWidth - 30, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(8, 145, 178);
        doc.text('All Class Probabilities', 20, yPos + 6);
        yPos += 15;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const sortedProbs = Object.entries(result.class_probabilities)
            .sort(([, a], [, b]) => b - a);

        sortedProbs.forEach(([className, prob]) => {
            doc.text(`${className}: ${(prob * 100).toFixed(1)}%`, 20, yPos);
            yPos += 6;
        });
        yPos += 10;

        // Triage Assessment
        const triageColors: { [key: string]: [number, number, number] } = {
            'CRITICAL': [220, 38, 38],
            'HIGH': [245, 158, 11],
            'MODERATE': [59, 130, 246]
        };

        const triageColor = triageColors[result.triage.level] || [100, 100, 100];
        doc.setFillColor(...triageColor);
        doc.rect(15, yPos, pageWidth - 30, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(`Triage Assessment: ${result.triage.level}`, 20, yPos + 6);
        yPos += 15;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        yPos = addText(`Message: ${result.triage.message}`, 20, yPos, pageWidth - 40);
        yPos += 7;
        doc.text(`Requires Immediate Attention: ${result.triage.requires_immediate_attention ? 'YES' : 'No'}`, 20, yPos);
        yPos += 7;
        doc.text(`Melanoma Probability: ${(result.triage.melanoma_probability * 100).toFixed(1)}%`, 20, yPos);
        yPos += 15;

        // Check if we need a new page
        if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
        }

        // Clinical Information
        doc.setFillColor(240, 240, 240);
        doc.rect(15, yPos, pageWidth - 30, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(8, 145, 178);
        doc.text(`Clinical Information: ${result.clinical_details.name}`, 20, yPos + 6);
        yPos += 15;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        yPos = addText(`Definition: ${result.clinical_details.definition}`, 20, yPos, pageWidth - 40);
        yPos += 7;
        doc.text(`Severity: ${result.clinical_details.severity}`, 20, yPos);
        yPos += 10;

        doc.setFont('helvetica', 'bold');
        doc.text('Characteristics:', 20, yPos);
        yPos += 7;
        doc.setFont('helvetica', 'normal');

        result.clinical_details.characteristics.forEach(char => {
            if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
            }
            yPos = addText(`• ${char}`, 25, yPos, pageWidth - 45);
            yPos += 5;
        });
        yPos += 10;

        // Model Information
        if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFillColor(240, 240, 240);
        doc.rect(15, yPos, pageWidth - 30, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(8, 145, 178);
        doc.text('Model Information', 20, yPos + 6);
        yPos += 15;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Model Type: ${result.model_info.model_type}`, 20, yPos);
        yPos += 7;
        doc.text(`Input Shape: ${result.model_info.input_shape}`, 20, yPos);
        yPos += 7;
        doc.text(`Preprocessing: ${result.model_info.preprocessing}`, 20, yPos);
        yPos += 7;
        doc.text(`Using Placeholder: ${result.model_info.using_placeholder}`, 20, yPos);
        yPos += 15;

        // Medical Disclaimer
        if (yPos > pageHeight - 70) {
            doc.addPage();
            yPos = 20;
        }

        const disclaimerHeight = 60; // Increased height
        doc.setFillColor(254, 243, 199);
        doc.rect(15, yPos, pageWidth - 30, disclaimerHeight, 'F');
        doc.setDrawColor(245, 158, 11);
        doc.setLineWidth(0.5);
        doc.rect(15, yPos, pageWidth - 30, disclaimerHeight);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(245, 158, 11);
        doc.text('MEDICAL DISCLAIMER', 20, yPos + 8);
        yPos += 15;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        yPos = addText('IMPORTANT: This system is designed to assist healthcare professionals in identifying potential skin conditions. It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment.', 20, yPos, pageWidth - 40, 9);
        yPos += 5;
        yPos = addText('Core Principle: "The AI serves to flag high-risk cases; ultimate accountability remains with the clinician."', 20, yPos, pageWidth - 40, 9);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        yPos = addText('Action Required: Please consult with a qualified healthcare provider for proper diagnosis and treatment recommendations.', 20, yPos, pageWidth - 40, 9);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Skin Disease Diagnosis System v2.0.0 | Powered by EfficientNetB0 | Research Paper Implementation', pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text('This report is for medical professional use only', pageWidth / 2, pageHeight - 5, { align: 'center' });

        // Save PDF
        doc.save(`Skin-Disease-Report-${new Date().getTime()}.pdf`);
    };

    return (
        <button
            onClick={generatePDF}
            className="w-full mt-6 px-6 py-3 bg-medical-primary text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-medical-primary focus:ring-offset-2"
            aria-label="Download diagnosis report as PDF file"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Report (PDF)
        </button>
    );
}
