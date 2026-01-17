'use client'

import { DashboardHeader } from '@/components/dashboard'
import { Image, Upload, Search } from 'lucide-react'

export default function GalleryPage() {
  return (
    <>
      <DashboardHeader
        title="Gallery Management"
        subtitle="Manage photos and media for events, news, and shooters"
      />

      <div className="p-6 space-y-6">
        {/* Search and Upload */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search media..."
              className="input pl-10"
            />
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Media
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-primary mb-4">All Media Files</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Placeholder */}
            <div className="aspect-square rounded-card border-2 border-dashed border-neutral-300 flex items-center justify-center">
              <div className="text-center p-4">
                <Image className="h-12 w-12 mx-auto mb-2 text-neutral-400" />
                <p className="text-sm text-neutral-500">No media uploaded yet</p>
                <button className="text-interactive text-sm mt-2 hover:underline">
                  Upload your first image
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-primary mb-4">Upload Guidelines</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600">
            <li>Recommended image size: 1920x1080px or higher</li>
            <li>Supported formats: JPG, PNG, WebP</li>
            <li>Maximum file size: 5MB per image</li>
            <li>Use descriptive filenames for better organization</li>
            <li>Compress images before uploading for faster load times</li>
          </ul>
        </div>
      </div>
    </>
  )
}
