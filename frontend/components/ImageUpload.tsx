/**
 * Image Upload Component
 * Drag-and-drop interface for medical image upload
 */

'use client';

import React, { useState, useRef } from 'react';

interface ImageUploadProps {
    onImageSelect: (file: File) => void;
    selectedImage: File | null;
}

export default function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = async (file: File) => {
        setUploadProgress(0);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPEG, PNG)');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        // Show quick validation progress
        setUploadProgress(50);

        // Validate image quality
        try {
            await validateImageQuality(file);
        } catch (error: any) {
            alert(error.message);
            setUploadProgress(0);
            return;
        }

        setUploadProgress(100);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
            setUploadProgress(0); // Reset immediately
        };
        reader.readAsDataURL(file);

        onImageSelect(file);
    };

    const validateImageQuality = async (file: File): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
                // Check minimum resolution
                if (img.width < 100 || img.height < 100) {
                    reject(new Error('Image resolution too low. Minimum required: 100x100 pixels.'));
                    return;
                }

                // Check if image is too small (likely corrupted)
                if (img.width < 50 || img.height < 50) {
                    reject(new Error('Image appears to be corrupted or invalid.'));
                    return;
                }

                URL.revokeObjectURL(img.src);
                resolve(true);
            };
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                reject(new Error('Invalid or corrupted image file.'));
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const clearImage = () => {
        setPreview(null);
        onImageSelect(null as any);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="medical-card">
            <h3 className="text-lg font-semibold text-medical-text mb-4">
                Upload Skin Lesion Image
            </h3>

            {!preview ? (
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload skin lesion image. Click or drag and drop to select a file."
                    onClick={handleClick}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleClick();
                        }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-medical-primary focus:ring-offset-2 ${isDragging
                        ? 'border-medical-primary bg-cyan-50'
                        : 'border-medical-border hover:border-medical-primary hover:bg-gray-50'
                        }`}
                >
                    <svg
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                        {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500">
                        JPEG or PNG (max 10MB)
                    </p>

                    {/* Progressive Upload Indicator */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-4" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100}>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-medical-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Processing... {uploadProgress}%</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border border-medical-border">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-auto max-h-96 object-contain bg-gray-50"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleClick}
                            aria-label="Change uploaded image"
                            className="flex-1 px-4 py-2 border border-medical-primary text-medical-primary rounded-lg hover:bg-cyan-50 transition-colors focus:outline-none focus:ring-2 focus:ring-medical-primary"
                        >
                            Change Image
                        </button>
                        <button
                            onClick={clearImage}
                            aria-label="Clear uploaded image"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Clear
                        </button>
                    </div>
                    {selectedImage && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">File:</span> {selectedImage.name} (
                            {(selectedImage.size / 1024).toFixed(1)} KB)
                        </p>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileInput}
                className="hidden"
                aria-label="File input for skin lesion image"
            />
        </div>
    );
}
