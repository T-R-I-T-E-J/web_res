'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard'
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, Save, 
  Camera, AlertCircle, CheckCircle, CreditCard, 
  FileText, Briefcase, Globe, Info
} from 'lucide-react'
import clsx from 'clsx'

const tabs = [
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'guardian', label: 'Parent/Guardian', icon: Briefcase },
  { id: 'address', label: 'Address Details', icon: MapPin },
  { id: 'passport', label: 'Passport Details', icon: Globe },
  { id: 'media', label: 'Photo & Signature', icon: Camera },
]

const classifications = [
  { code: 'SH1', description: 'Athletes with lower limb impairment - Able to support rifle/pistol without support' },
  { code: 'SH2', description: 'Athletes with upper limb impairment - Require shooting stand for support' },
  { code: 'VI1', description: 'Visual impairment class 1 (Most severe)' },
  { code: 'VI2', description: 'Visual impairment class 2' },
  { code: 'VI3', description: 'Visual impairment class 3 (Least severe)' },
]

const ShooterProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    // Personal
    firstName: 'Avani',
    lastName: 'Lekhara',
    email: 'avani@example.com',
    phone: '+91 98765 43210',
    dateOfBirth: '2001-11-08',
    gender: 'Female',
    bloodGroup: 'O+',
    nationality: 'Indian',
    
    // Guardian
    guardianName: 'Praveen Lekhara',
    guardianRelation: 'Father',
    guardianPhone: '+91 98290 12345',
    
    // Address
    address: '123, Shooter Colony, Vidhyadhar Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    district: 'Jaipur',
    
    // Passport
    passportNumber: 'Z1234567',
    passportExpiry: '2030-05-15',
    placeOfIssue: 'Jaipur',
    
    // System
    classification: 'SH1',
    psciId: 'PSCI-2018-00234',
    membership: 'Gold',
    memberSince: '2018',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <>
      <DashboardHeader
        title="Shooter Profile"
        subtitle="Manage your institutional records and personal details"
      />

      <div className="p-6 space-y-6">
        {/* Top Profile Card */}
        <div className="card">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <User className="w-12 h-12 text-neutral-400" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-card hover:bg-primary-dark transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-heading text-2xl font-bold text-primary">
                  {formData.firstName} {formData.lastName}
                </h2>
                <span className="badge-success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Athlete
                </span>
              </div>
              <p className="text-neutral-500 flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                NPSML ID: {formData.psciId} • Member since {formData.memberSince}
              </p>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="btn-outline">
                  Edit Information
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-neutral-200 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-neutral-500 hover:text-primary hover:bg-neutral-50'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="label">First Name</label>
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
                  <label className="label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="label">Date of Birth</label>
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
                  <label className="label">Gender</label>
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
                <div>
                  <label className="label">Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="label">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guardian' && (
            <div className="space-y-6">
              <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Parent/Guardian Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Guardian Name</label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="label">Relationship</label>
                  <select
                    name="guardianRelation"
                    value={formData.guardianRelation}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Guardian Phone</label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="space-y-6">
              <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="label">Communication Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="label">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="label">State</label>
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
                  <label className="label">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'passport' && (
            <div className="space-y-6">
              <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Passport Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="label">Passport Number</label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input font-data', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="label">Date of Expiry</label>
                  <input
                    type="date"
                    name="passportExpiry"
                    value={formData.passportExpiry}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
                <div>
                  <label className="label">Place of Issue</label>
                  <input
                    type="text"
                    name="placeOfIssue"
                    value={formData.placeOfIssue}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={clsx('input', !isEditing && 'bg-neutral-50')}
                  />
                </div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-card border border-neutral-200">
                <p className="text-sm text-neutral-600 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Passport details are mandatory for participation in international competitions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-8">
              <h3 className="font-heading font-semibold text-lg text-primary flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photo & Signature
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="label">Profile Photo</label>
                  <div className="border-2 border-dashed border-neutral-200 rounded-card p-8 text-center bg-neutral-50">
                    <div className="w-32 h-40 bg-neutral-200 mx-auto mb-4 flex items-center justify-center">
                      <User className="w-16 h-16 text-neutral-400" />
                    </div>
                    <button className="btn-outline text-sm">Upload Photo</button>
                    <p className="text-xs text-neutral-500 mt-2">Max 2MB, JPG/PNG only</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="label">Specimen Signature</label>
                  <div className="border-2 border-dashed border-neutral-200 rounded-card p-8 text-center bg-neutral-50">
                    <div className="w-48 h-24 bg-neutral-200 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-neutral-400" />
                    </div>
                    <button className="btn-outline text-sm">Upload Signature</button>
                    <p className="text-xs text-neutral-500 mt-2">Max 1MB, JPG/PNG only</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Classification Summary Card */}
        <div className="card bg-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-primary">WSPS Classification:</span>
                <span className="font-heading font-bold text-lg text-accent">{formData.classification}</span>
              </div>
              <p className="text-sm text-neutral-600">
                {classifications.find(c => c.code === formData.classification)?.description}
              </p>
              <button className="text-sm text-interactive font-medium mt-2 hover:underline">
                Request Re-classification
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShooterProfilePage
