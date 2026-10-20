import React, { useState } from 'react';
import type { UserSettings } from '../types';
import {
  saveSettings,
  generateProgressSummary,
  getFailedAnswers,
  clearAllData
} from '../lib/storage';

type SettingsScreenProps = {
  settings: UserSettings;
  onSettingsChange: (newSettings: UserSettings) => void;
  onClose: () => void;
  onDataCleared: () => void;
  totalCards: number;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onSettingsChange,
  onClose,
  onDataCleared,
  totalCards
}) => {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleSpeedChange = (speed: 'normal' | 'slow') => {
    const updated = { ...settings, defaultSpeed: speed };
    saveSettings(updated);
    onSettingsChange(updated);
  };

  const handleEnglishToggle = (show: boolean) => {
    const updated = { ...settings, showEnglishDefault: show };
    saveSettings(updated);
    onSettingsChange(updated);
  };

  const handleCopyProgress = async () => {
    const summary = generateProgressSummary(totalCards);
    try {
      await navigator.clipboard.writeText(summary);
      setCopyFeedback('Progress copied to clipboard! Paste it into WhatsApp.');
    } catch {
      setCopyFeedback(`Clipboard error. Here is your text: ${summary}`);
    }
    setTimeout(() => setCopyFeedback(null), 4000);
  };

  const handleExportFailedAnswers = async () => {
    const list = getFailedAnswers();
    const jsonStr = JSON.stringify(list, null, 2);
    try {
      await navigator.clipboard.writeText(jsonStr);
      setCopyFeedback(`Exported ${list.length} failed answer(s) to clipboard as JSON!`);
    } catch {
      setCopyFeedback(`Could not copy to clipboard. Total failed entries: ${list.length}`);
    }
    setTimeout(() => setCopyFeedback(null), 4000);
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all progress, failed answers, and settings? This cannot be undone.'
    );
    if (confirmed) {
      clearAllData();
      onDataCleared();
      setCopyFeedback('All local data has been cleared.');
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  return (
    <div className="settings-view">
      <header className="app-header" style={{ margin: '-20px -20px 10px -20px' }}>
        <button type="button" className="btn-ghost" onClick={onClose}>
          ← Back
        </button>
        <h2 style={{ fontSize: '1.2rem' }}>Settings & Data</h2>
        <div style={{ width: '40px' }} />
      </header>

      {copyFeedback && (
        <div
          className="feedback-box feedback-success"
          role="status"
          style={{ marginBottom: '8px' }}
        >
          {copyFeedback}
        </div>
      )}

      {/* Preferences */}
      <div className="settings-group">
        <h3 className="settings-group-title">Preferences</h3>

        <div className="setting-row">
          <div>
            <div className="setting-label">Default audio speed</div>
            <div className="setting-desc">Speed used when playing Malay dialogue</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className={`mode-btn ${settings.defaultSpeed === 'normal' ? 'active' : ''}`}
              onClick={() => handleSpeedChange('normal')}
            >
              Normal (1.0x)
            </button>
            <button
              type="button"
              className={`mode-btn ${settings.defaultSpeed === 'slow' ? 'active' : ''}`}
              onClick={() => handleSpeedChange('slow')}
            >
              Slow (0.85x)
            </button>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <div className="setting-label">Show English by default</div>
            <div className="setting-desc">Display translations below dialogue lines</div>
          </div>
          <input
            type="checkbox"
            style={{ width: '20px', height: '20px' }}
            checked={settings.showEnglishDefault}
            onChange={(e) => handleEnglishToggle(e.target.checked)}
          />
        </div>
      </div>

      {/* Progress & Sharing */}
      <div className="settings-group">
        <h3 className="settings-group-title">Feedback & Progress</h3>

        <div>
          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%' }}
            onClick={handleCopyProgress}
          >
            📋 Copy my progress
          </button>
          <p className="setting-desc" style={{ marginTop: '6px' }}>
            Copies a compact summary text that you can paste into WhatsApp to share with the author.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%' }}
            onClick={handleExportFailedAnswers}
          >
            📥 Export failed answers
          </button>
          <p className="setting-desc" style={{ marginTop: '6px' }}>
            Copies JSON of answers rejected by the matcher. Native speakers use this to expand accepted phrases.
          </p>
        </div>
      </div>

      {/* Privacy & Reset */}
      <div className="settings-group">
        <h3 className="settings-group-title">Privacy & Storage</h3>
        <p className="setting-desc">
          Everyday Malay stores 100% of your progress locally on this device. No trackers, no accounts, and no data is sent to any server.
        </p>

        <button
          type="button"
          className="btn-secondary"
          style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
          onClick={handleClearData}
        >
          🗑️ Clear my data
        </button>
      </div>
    </div>
  );
};
