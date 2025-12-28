'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard'
import { Upload, FileSpreadsheet, Save, Eye, Check, AlertCircle, RefreshCw } from 'lucide-react'
import clsx from 'clsx'

const competitions = [
  { id: 1, name: '68th NSCC (Rifle)', date: 'Dec 2024', status: 'in_progress' },
  { id: 2, name: 'State Championship - Maharashtra', date: 'Nov 2024', status: 'published' },
  { id: 3, name: 'Selection Trial - Asian Games', date: 'Oct 2024', status: 'published' },
]

const events = [
  { code: 'R1', name: '10m Air Rifle Standing SH1' },
  { code: 'R2', name: '10m Air Rifle Standing SH2' },
  { code: 'P1', name: '10m Air Pistol SH1' },
]

const sampleScores = [
  { rank: 1, name: 'Avani Lekhara', state: 'Rajasthan', qualification: 628.5, final: 249.7, total: 634.5, verified: true },
  { rank: 2, name: 'Deepender Singh', state: 'Haryana', qualification: 624.2, final: 247.1, total: 629.8, verified: true },
  { rank: 3, name: 'Swaroop Unhalkar', state: 'Maharashtra', qualification: 621.8, final: 244.5, total: 625.3, verified: false },
  { rank: 4, name: 'Pooja Agarwal', state: 'Uttar Pradesh', qualification: 618.4, final: 241.2, total: 621.4, verified: false },
]

const AdminScoresPage = () => {
  const [selectedCompetition, setSelectedCompetition] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState('R1')
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    setTimeout(() => setIsUploading(false), 2000)
  }

  return (
    <>
      <DashboardHeader
        title="Scores & Results"
        subtitle="Upload, verify, and publish competition scores"
      />

      <div className="p-6 space-y-6">
        {/* Competition & Event Selection */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Competition
              </label>
              <select
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(Number(e.target.value))}
                className="input"
              >
                {competitions.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} - {comp.date}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="input"
              >
                {events.map((event) => (
                  <option key={event.code} value={event.code}>
                    {event.code} - {event.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-primary gap-2">
                <RefreshCw className="w-4 h-4" />
                Load Scores
              </button>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="card">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4">
            Upload Scores
          </h2>
          <div className="border-2 border-dashed border-neutral-200 rounded-card p-8 text-center">
            <div className="flex flex-col items-center">
              <FileSpreadsheet className="w-12 h-12 text-neutral-400 mb-4" />
              <p className="text-neutral-600 mb-2">
                Drag and drop your score file here, or click to browse
              </p>
              <p className="text-sm text-neutral-400 mb-4">
                Supported formats: CSV, Excel (.xlsx), Sius-Ascor export
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="btn-primary gap-2"
                >
                  {isUploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload File
                    </>
                  )}
                </button>
                <button className="btn-outline gap-2">
                  Download Template
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scores Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-semibold text-lg text-primary">
                Score Entry - {events.find(e => e.code === selectedEvent)?.name}
              </h2>
              <p className="text-sm text-neutral-500">
                Verify scores before publishing. Click on a score to edit.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button className="btn-accent gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-16">Rank</th>
                  <th>Athlete</th>
                  <th>State</th>
                  <th className="text-right">Qualification</th>
                  <th className="text-right">Final</th>
                  <th className="text-right">Total</th>
                  <th className="text-center w-24">Verified</th>
                  <th className="w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sampleScores.map((score) => (
                  <tr key={score.rank}>
                    <td>
                      <span className={clsx(
                        'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold',
                        score.rank === 1 && 'bg-accent text-white',
                        score.rank === 2 && 'bg-neutral-300 text-neutral-700',
                        score.rank === 3 && 'bg-amber-600 text-white',
                        score.rank > 3 && 'bg-neutral-100 text-neutral-600'
                      )}>
                        {score.rank}
                      </span>
                    </td>
                    <td className="font-medium text-neutral-700">{score.name}</td>
                    <td className="text-neutral-600">{score.state}</td>
                    <td className="text-right">
                      <input
                        type="number"
                        value={score.qualification}
                        className="w-20 px-2 py-1 text-right font-data border border-transparent hover:border-neutral-200 rounded focus:border-primary focus:outline-none"
                        step="0.1"
                      />
                    </td>
                    <td className="text-right">
                      <input
                        type="number"
                        value={score.final}
                        className="w-20 px-2 py-1 text-right font-data border border-transparent hover:border-neutral-200 rounded focus:border-primary focus:outline-none"
                        step="0.1"
                      />
                    </td>
                    <td className="text-right">
                      <span className="font-data font-semibold text-neutral-700">
                        {score.total.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-center">
                      {score.verified ? (
                        <span className="inline-flex items-center text-success">
                          <Check className="w-5 h-5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-data-medium">
                          <AlertCircle className="w-5 h-5" />
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className={clsx(
                          'px-3 py-1 text-xs font-medium rounded',
                          score.verified
                            ? 'bg-success/10 text-success'
                            : 'bg-primary text-white hover:bg-primary-dark'
                        )}
                      >
                        {score.verified ? 'Verified' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Validation Summary */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-card">
            <h3 className="font-semibold text-neutral-700 mb-3">Validation Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">2</p>
                <p className="text-xs text-neutral-500">Verified</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-data-medium">2</p>
                <p className="text-xs text-neutral-500">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-error">0</p>
                <p className="text-xs text-neutral-500">Errors</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-700">4</p>
                <p className="text-xs text-neutral-500">Total</p>
              </div>
            </div>
          </div>

          {/* Publish Button */}
          <div className="mt-6 flex justify-end gap-3">
            <button className="btn-outline">
              Save as Draft
            </button>
            <button className="btn-primary bg-success hover:bg-success/90 gap-2">
              <Check className="w-4 h-4" />
              Publish Results
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminScoresPage

