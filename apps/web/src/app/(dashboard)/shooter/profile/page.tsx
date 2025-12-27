'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard'
import { User, Mail, Phone, MapPin, Calendar, Shield, Save, Camera, AlertCircle, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

const classifications = [
  { code: 'SH1', description: 'Athletes with lower limb impairment - Able to support rifle/pistol without support' },
  { code: 'SH2', description: 'Athletes with upper limb impairment - Require shooting stand for support' },
  { code: 'VI1', description: 'Visual impairment class 1 (Most severe)' },
  { code: 'VI2', description: 'Visual impairment class 2' },
  { code: 'VI3', description: 'Visual impairment class 3 (Least severe)' },
]

const ShooterProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'Avani',
    lastName: 'Lekhara',
    email: 'avani@example.com',
    phone: '+91 98765 43210',
    dateOfBirth: '2001-11-08',
    gender: 'Female',
    state: 'Rajasthan',
    city: 'Jaipur',
    address: '123, Shooter Colony, Jaipur',
    pincode: '302001',
    classification: 'SH1',
    psciId: 'PSCI-2018-00234',
    membership: 'Gold',
    memberSince: '2018',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  return (
    <>
      <DashboardHeader
        title="My Profile"
        subtitle="Manage your personal information and settings"
      />

      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <div className="card">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-neutral-400" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-card">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-heading text-2xl font-bold text-primary">
                  {formData.firstName} {formData.lastName}
                </h2>
                <span className="badge-success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-neutral-400" />
                  {formData.psciId}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  {formData.city}, {formData.state}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  Member since {formData.memberSince}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Classification Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-card p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-primary">WSPS Classification:</span>
                <span className="font-heading font-bold text-lg text-accent">{formData.classification}</span>
              </div>
              <p className="text-sm text-neutral-600">
                {classifications.find(c => c.code === formData.classification)?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="card">
            <h3 className="font-heading font-semibold text-lg text-primary mb-6">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={clsx('input', !isEditing && 'bg-neutral-50')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={clsx('input', !isEditing && 'bg-neutral-50')}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <h3 className="font-heading font-semibold text-lg text-primary mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input pl-12', !isEditing && 'bg-neutral-50')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input pl-12', !isEditing && 'bg-neutral-50')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={2}
                  className={clsx('input', !isEditing && 'bg-neutral-50')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Classification Info */}
        <div className="card">
          <h3 className="font-heading font-semibold text-lg text-primary mb-4">WSPS Classification Guide</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-20">Code</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {classifications.map((c) => (
                  <tr key={c.code} className={c.code === formData.classification ? 'bg-primary/5' : ''}>
                    <td>
                      <span className={clsx(
                        'font-data font-bold',
                        c.code === formData.classification && 'text-primary'
                      )}>
                        {c.code}
                      </span>
                    </td>
                    <td className="text-neutral-600">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShooterProfilePage

