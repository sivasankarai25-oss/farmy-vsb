import React from 'react';
import { Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Booking, CENTRE_STATUS_META, CentreStatus, ProcStatus } from '../../procurement/types';
import { prettyDate } from '../../procurement/logic';
import type { TFn } from '../../procurement/i18n';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-stone-200 shadow-xs ${className}`}>{children}</div>
);

export const BackBar: React.FC<{ title: string; subtitle?: string; onBack: () => void; right?: React.ReactNode }> = ({
  title, subtitle, onBack, right,
}) => (
  <div className="flex items-center gap-3">
    <button
      onClick={onBack}
      aria-label="Back"
      className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 shrink-0"
    >
      <ArrowLeft className="w-4 h-4 rtl-flip" />
    </button>
    <div className="min-w-0 flex-1">
      <h2 className="text-base font-extrabold text-stone-900 truncate">{title}</h2>
      {subtitle && <p className="text-[11px] text-stone-500 truncate">{subtitle}</p>}
    </div>
    {right}
  </div>
);

export const Spinner: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-16 text-stone-500">
    <Loader2 className="w-6 h-6 animate-spin mb-2 text-emerald-600" />
    {label && <p className="text-xs font-bold">{label}</p>}
  </div>
);

export const ErrorBox: React.FC<{ error: 'PERMISSION' | 'GENERIC' | string; t: TFn }> = ({ error, t }) => (
  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
    <span>{error === 'PERMISSION' ? t('errPermission') : error === 'GENERIC' ? t('errGeneric') : error}</span>
  </div>
);

export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; text?: string; action?: React.ReactNode }> = ({
  icon, title, text, action,
}) => (
  <Card className="p-8 text-center space-y-2">
    <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">{icon}</div>
    <h3 className="text-sm font-extrabold text-stone-900">{title}</h3>
    {text && <p className="text-xs text-stone-500 max-w-xs mx-auto">{text}</p>}
    {action && <div className="pt-2">{action}</div>}
  </Card>
);

export const CentrePill: React.FC<{ status: CentreStatus; t: TFn }> = ({ status, t }) => {
  const m = CENTRE_STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${m.cls}`}>
      {m.emoji} {t(`cs_${status}` as never)}
    </span>
  );
};

const PILL: Record<ProcStatus, string> = {
  BOOKED: 'bg-sky-50 text-sky-800 border-sky-200',
  ARRIVED: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  WEIGHING: 'bg-amber-50 text-amber-800 border-amber-200',
  QUALITY_CHECK: 'bg-amber-50 text-amber-800 border-amber-200',
  ACCEPTED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  REJECTED: 'bg-red-50 text-red-800 border-red-200',
  PAYMENT_PROCESSING: 'bg-amber-50 text-amber-800 border-amber-200',
  PAYMENT_COMPLETED: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  CANCELLED: 'bg-stone-100 text-stone-600 border-stone-300',
};

export const BookingStatusPill: React.FC<{ status: ProcStatus; t: TFn }> = ({ status, t }) => (
  <span className={`inline-flex items-center text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${PILL[status]}`}>
    {t(`st_${status}` as never)}
  </span>
);

// Horizontal chips to switch between the farmer's bookings.
export const BookingPicker: React.FC<{
  bookings: Booking[]; selectedId?: string; onSelect: (id: string) => void; t: TFn;
}> = ({ bookings, selectedId, onSelect, t }) => {
  if (bookings.length < 2) return null;
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">{t('myBookings')}</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {bookings.map(b => (
          <button
            key={b.id}
            onClick={() => onSelect(b.id)}
            className={`shrink-0 px-3 py-2 rounded-xl border text-start transition-colors ${
              b.id === selectedId ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div dir="ltr" className="text-xs font-black font-mono">{b.token}</div>
            <div className="text-[10px] opacity-80">{prettyDate(b.date)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const inputCls =
  'w-full px-3 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';
export const labelCls = 'block text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mb-1';
export const primaryBtn =
  'px-4 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2';
