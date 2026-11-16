// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsScreen } from './Settings';
import { clearAllData, loadProgress, saveCardProgress } from '../lib/storage';

describe('Settings data controls', () => {
  let root: Root | undefined; let host: HTMLDivElement | undefined;
  beforeEach(() => { Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }); host = document.createElement('div'); document.body.append(host); root = createRoot(host); clearAllData(); });
  afterEach(() => { if (root) act(() => root?.unmount()); host?.remove(); root = undefined; host = undefined; vi.restoreAllMocks(); Reflect.deleteProperty(URL, 'createObjectURL'); Reflect.deleteProperty(URL, 'revokeObjectURL'); clearAllData(); });
  const render = (onDataCleared = vi.fn()) => act(() => root?.render(<SettingsScreen settings={{ defaultSpeed: 'normal', showEnglishDefault: true }} onSettingsChange={vi.fn()} onClose={vi.fn()} onDataCleared={onDataCleared} onOpenOrientation={vi.fn()} totalCards={3} />));

  it('downloads a JSON export', () => {
    const create = vi.fn(() => 'blob:test');
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: create });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    render();
    act(() => [...host!.querySelectorAll('button')].find((button) => button.textContent?.includes('Download my local data'))?.click());
    expect(create).toHaveBeenCalledOnce(); expect(click).toHaveBeenCalledOnce();
    expect(host!.textContent).toContain('Your local data export has been downloaded');
  });

  it('deletes local progress only after explicit confirmation', () => {
    saveCardProgress('shop-01', { started: true });
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onDataCleared = vi.fn(); render(onDataCleared);
    act(() => [...host!.querySelectorAll('button')].find((button) => button.textContent?.includes('Clear my data'))?.click());
    expect(confirm).toHaveBeenCalledOnce(); expect(onDataCleared).toHaveBeenCalledOnce(); expect(loadProgress()).toEqual({});
  });

  it('preserves progress when deletion confirmation is cancelled', () => {
    saveCardProgress('shop-01', { started: true });
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const onDataCleared = vi.fn(); render(onDataCleared);
    act(() => [...host!.querySelectorAll('button')].find((button) => button.textContent?.includes('Clear my data'))?.click());
    expect(onDataCleared).not.toHaveBeenCalled();
    expect(loadProgress()['shop-01'].started).toBe(true);
  });
});
