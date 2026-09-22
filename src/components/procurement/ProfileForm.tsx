import React, { useState } from 'react';
import { UserRound, Loader2 } from 'lucide-react';
import { ProcProfile, PROCUREMENT_CROPS } from '../../procurement/types';
import { saveProfile } from '../../procurement/service';
import { LANGUAGE_OPTIONS } from '../../utils/translations';
import type { TFn } from '../../procurement/i18n';
import { BackBar, Card, ErrorBox, inputCls, labelCls, primaryBtn } from './ui';

interface Props {
  uid: string;
  initial: ProcProfile;
  isEdit: boolean;
  t: TFn;
  onSaved: (p: ProcProfile) => void;
  onBack?: () => void;
}

export const ProfileForm: React.FC<Props> = ({ uid, initial, isEdit, t, onSaved, onBack }) => {
  const [p, setP] = useState<ProcProfile>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof ProcProfile, v: string) => setP(prev => ({ ...prev, [k]: v }));

  const valid = p.name.trim().length > 1 && /^[+\d][\d\s-]{7,}$/.test(p.mobile.trim()) && p.village.trim() && p.district.trim() && p.state.trim();

  const submit = async () => {
    if (!valid || saving) return;
    setSaving(true);
    setErr(null);
    try {
      const clean: ProcProfile = {
        ...p, name: p.name.trim(), mobile: p.mobile.trim(), village: p.village.trim(),
        district: p.district.trim(), state: p.state.trim(), updatedAt: Date.now(),
      };
      await saveProfile(uid, clean);
      onSaved(clean);
    } catch (e: any) {
      setErr(e?.code === 'permission-denied' ? 'PERMISSION' : 'GENERIC');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pb-24 max-w-xl mx-auto">
      {isEdit && onBack ? (
        <BackBar title={t('profileTitle')} onBack={onBack} />
      ) : (
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white p-5 rounded-2xl shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-2"><UserRound className="w-5 h-5" /></div>
          <h1 className="text-lg font-black">{t('registerTitle')}</h1>
          <p className="text-xs text-emerald-100/90 mt-1">{t('registerSub')}</p>
        </div>
      )}

      <Card className="p-4 space-y-3">
        <div>
          <label className={labelCls}>{t('farmerId')}</label>
          <div dir="ltr" className="px-3 py-2.5 text-sm font-mono font-bold bg-stone-50 border border-stone-200 rounded-xl text-stone-700 text-start">{p.farmerId}</div>
        </div>
        <div>
          <label className={labelCls}>{t('farmerName')}</label>
          <input className={inputCls} value={p.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
        </div>
        <div>
          <label className={labelCls}>{t('mobile')}</label>
          <input className={inputCls} dir="ltr" inputMode="tel" value={p.mobile} onChange={e => set('mobile', e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>{t('village')}</label>
            <input className={inputCls} value={p.village} onChange={e => set('village', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t('district')}</label>
            <input className={inputCls} value={p.district} onChange={e => set('district', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t('state')}</label>
            <input className={inputCls} value={p.state} onChange={e => set('state', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t('prefLanguage')}</label>
            <select className={inputCls} value={p.language} onChange={e => set('language', e.target.value)}>
              {LANGUAGE_OPTIONS.map(o => <option key={o.code} value={o.code}>{o.nativeLabel}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>{t('mainCrop')}</label>
            <select className={inputCls} value={p.primaryCrop} onChange={e => set('primaryCrop', e.target.value)}>
              <option value="">{t('selectPlaceholder')}</option>
              {PROCUREMENT_CROPS.map(c => <option key={c} value={c}>{t(`crop_${c}` as never)}</option>)}
            </select>
          </div>
        </div>
        {err && <ErrorBox error={err} t={t} />}
        <button onClick={submit} disabled={!valid || saving} className={`${primaryBtn} w-full`}>
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? t('saveChanges') : t('saveContinue')}
        </button>
      </Card>
    </div>
  );
};
