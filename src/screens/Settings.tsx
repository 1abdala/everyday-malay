import React, { useState } from 'react';
import type { UserSettings } from '../types';
import {
  saveSettings,
  generateProgressSummary,
  getFailedAnswers,
  clearAllData,
  exportLocalData,
  loadSavedPhrases,
  removeSavedPhrase,
  isPersistentStorageAvailable
} from '../lib/storage';

type SettingsScreenProps = {
  settings: UserSettings;
  onSettingsChange: (newSettings: UserSettings) => void;
  onClose: () => void;
  onDataCleared: () => void;
  onOpenOrientation: () => void;
  totalCards: number;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onSettingsChange,
  onClose,
  onDataCleared,
  onOpenOrientation,
  totalCards
}) => {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [savedPhrases, setSavedPhrases] = useState(loadSavedPhrases);
  const [storageAvailable] = useState(isPersistentStorageAvailable);

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

  const handleDownloadData = () => {
    const json = JSON.stringify(exportLocalData(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `everyday-malay-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCopyFeedback('Your local data export has been downloaded. Keep the file somewhere private.');
    setTimeout(() => setCopyFeedback(null), 4000);
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      'Delete all locally stored scenario progress, XP, role-play drafts, failed answers, saved phrases, onboarding state, and settings? This cannot be undone.'
    );
    if (confirmed) {
      clearAllData();
      setSavedPhrases([]);
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
      {!storageAvailable && <p className="storage-warning" role="alert">This browser cannot save data reliably right now. Progress may only remain until this page closes.</p>}

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
        <h3 className="settings-group-title">Saved for review</h3>
        {savedPhrases.length === 0 ? <p className="setting-desc">Save a phrase from Key Phrases to keep it here for quick practice.</p> : (
          <div className="saved-phrase-list">
            {savedPhrases.map((phrase) => <article className="saved-phrase" key={phrase.id}>
              <strong className="malay-text" lang="ms">{phrase.malay}</strong><span className="english-text" lang="en">{phrase.english}</span>
              <button type="button" className="btn-ghost" aria-label={`Remove saved phrase ${phrase.malay}`} onClick={() => {
                removeSavedPhrase(phrase.id);
                setSavedPhrases((current) => current.filter((item) => item.id !== phrase.id));
              }}>Remove</button>
            </article>)}
          </div>
        )}
      </div>

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
          Everything below stays in this browser; the app does not upload or sync it:
        </p>
        <ul className="privacy-data-list"><li>Scenario progress and completion</li><li>Unfinished role-play drafts</li><li>Failed-answer logs and local activity events</li><li>Saved phrases</li><li>XP and onboarding/starter completion</li><li>Settings</li></ul>
        <p className="setting-desc">Clearing browser data, changing browser or device, or using another site origin can make saved data unavailable. Export a private copy first if you want a backup.</p>

        <button type="button" className="btn-secondary" style={{ width: '100%', marginBottom: 8 }} onClick={handleDownloadData}>
          Download my local data (JSON)
        </button>
        <p className="setting-desc" style={{ marginTop: 0 }}>
          The export includes progress, XP, role-play drafts, failed answers, activity events, preferences, saved phrases, and onboarding status. It may contain your practice answers; store it privately.
        </p>

        <button type="button" className="btn-secondary" style={{ width: '100%', marginBottom: 12 }} onClick={onOpenOrientation}>
          Read the getting-started guide
        </button>

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
