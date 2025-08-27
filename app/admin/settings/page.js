'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Bell, Shield, Globe, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'CarBook',
      siteDescription: 'Modern Car Booking Platform',
      contactEmail: 'admin@carbook.com',
      supportPhone: '+1-555-0123'
    },
    booking: {
      maxBookingDuration: 24,
      minBookingAdvance: 1,
      cancellationWindow: 2,
      lockDuration: 10
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true
    },
    security: {
      requireEmailVerification: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordExpiry: 90
    }
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        // Show success message
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" />
            System Settings
          </h1>
          <p className="text-base-content/70 mt-1">Configure system preferences and options</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Globe className="w-5 h-5" />
              General Settings
            </h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">Site Name</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">Site Description</label>
                <textarea
                  className="textarea textarea-bordered"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">Contact Email</label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={settings.general.contactEmail}
                  onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Booking Settings
            </h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">Max Booking Duration (hours)</label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={settings.booking.maxBookingDuration}
                  onChange={(e) => updateSetting('booking', 'maxBookingDuration', parseInt(e.target.value))}
                />
              </div>
              <div className="form-control">
                <label className="label">Min Advance Booking (hours)</label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={settings.booking.minBookingAdvance}
                  onChange={(e) => updateSetting('booking', 'minBookingAdvance', parseInt(e.target.value))}
                />
              </div>
              <div className="form-control">
                <label className="label">Lock Duration (minutes)</label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={settings.booking.lockDuration}
                  onChange={(e) => updateSetting('booking', 'lockDuration', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Email Notifications</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">SMS Notifications</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Admin Alerts</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={settings.notifications.adminAlerts}
                    onChange={(e) => updateSetting('notifications', 'adminAlerts', e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Require Email Verification</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={settings.security.requireEmailVerification}
                    onChange={(e) => updateSetting('security', 'requireEmailVerification', e.target.checked)}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label">Session Timeout (minutes)</label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div className="form-control">
                <label className="label">Max Login Attempts</label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}