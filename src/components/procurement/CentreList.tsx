import React, { useMemo, useState } from 'react';
import { Search, MapPin, Navigation2, Users, CalendarDays, Clock, Building2 } from 'lucide-react';
import { Centre, CentreLive, CentreStatus, PROCUREMENT_CROPS } from '../../procurement/types';
import { capacityPerDay, distanceKm } from '../../procurement/logic';
import type { TFn } from '../../procurement/i18n';
import { BackBar, Card, CentrePill, EmptyState, inputCls } from './ui';

interface Props {
  t: TFn;
  centres: Centre[];
  live: Record<string, CentreLive>;
  onBack: () => void;
  onBook: (centreId: string) => void;
}

export const CentreList: React.FC<Props> = ({ t, centres, live, onBack, onBook }) => {
  const [q, setQ] = useState('');
  const [crop, setCrop] = useState('');
  const [status, setStatus] = useState<'all' | CentreStatus>('all');
  const [pos, setPos] = useState<{ lat: number; lon: number } | null>(null);
  const [geoErr, setGeoErr] = useState(false);

  const locate = () => {
    setGeoErr(false);
    if (!navigator.geolocation) { setGeoErr(true); return; }
    navigator.geolocation.getCurrentPosition(
      p => setPos({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => setGeoErr(true),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return centres
      .map(c => ({
        c,
        l: live[c.id],
        km: pos && c.lat != null && c.lon != null ? distanceKm(pos.lat, pos.lon, c.lat, c.lon) : null,
      }))
      .filter(({ c, l }) =>
        (!needle || [c.name, c.address, c.district, c.state].some(s => s.toLowerCase().includes(needle))) &&
        (!crop || c.supportedCrops.includes(crop)) &&
        (status === 'all' || l?.status === status))
      .sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9) || a.c.name.localeCompare(b.c.name));
  }, [centres, live, q, crop, status, pos]);

  const chips: ('all' | CentreStatus)[] = ['all', 'available', 'busy', 'full', 'closed'];

  return (
    <div className="space-y-4 pb-24">
      <BackBar title={t('findCentre')} subtitle={t('centresToday')} onBack={onBack} />

      <Card className="p-3 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute start-3 top-3.5" />
          <input className={`${inputCls} ps-9`} placeholder={t('searchCentre')} value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select className={inputCls} value={crop} onChange={e => setCrop(e.target.value)}>
            <option value="">{t('allCrops')}</option>
            {PROCUREMENT_CROPS.map(c => <option key={c} value={c}>{t(`crop_${c}` as never)}</option>)}
          </select>
          <button onClick={locate} className="px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-emerald-800 hover:bg-emerald-50 flex items-center justify-center gap-1.5">
            <Navigation2 className="w-3.5 h-3.5" /> {pos ? t('locationOn') : t('useMyLocation')}
          </button>
        </div>
        {geoErr && <p className="text-[11px] text-amber-700 font-medium">{t('locationDenied')}</p>}
        <div className="flex gap-1.5 overflow-x-auto">
          {chips.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-extrabold border ${
                status === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200'
              }`}
            >
              {s === 'all' ? t('all') : t(`cs_${s}` as never)}
            </button>
          ))}
        </div>
      </Card>

      {centres.length === 0 ? (
        <EmptyState icon={<Building2 className="w-6 h-6" />} title={t('noCentres')} text={t('noCentresHint')} />
      ) : rows.length === 0 ? (
        <EmptyState icon={<Search className="w-6 h-6" />} title={t('noMatch')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rows.map(({ c, l, km }) => (
            <Card key={c.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-stone-900">{c.name}</h3>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0 text-emerald-600" />
                    <span className="truncate">{c.address}</span>
                  </p>
                  {km != null && <p className="text-[11px] font-bold text-emerald-700 mt-0.5">{t('kmAway', { km: km.toFixed(km < 10 ? 1 : 0) })}</p>}
                </div>
                {l && <CentrePill status={l.status} t={t} />}
              </div>

              <div className="flex flex-wrap gap-1">
                {c.supportedCrops.map(sc => (
                  <span key={sc} className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">{t(`crop_${sc}` as never) || sc}</span>
                ))}
              </div>

              {l && (
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { k: 'capacity', v: capacityPerDay(c) },
                    { k: 'booked', v: l.booked },
                    { k: 'available', v: l.available },
                    { k: 'queueNow', v: l.queue },
                  ].map(x => (
                    <div key={x.k} className="bg-stone-50 rounded-xl py-2 px-1">
                      <div className="text-base font-black text-stone-900">{x.v}</div>
                      <div className="text-[10px] font-bold text-stone-500 leading-tight">{t(x.k as never)}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-stone-500 flex items-center gap-1" dir="ltr">
                  <Clock className="w-3 h-3" /> {c.openTime}–{c.closeTime}
                </span>
                <button
                  onClick={() => onBook(c.id)}
                  disabled={c.closed}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 text-white text-xs font-black flex items-center gap-1.5"
                >
                  <CalendarDays className="w-3.5 h-3.5" /> {t('bookHere')}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
