import React from 'react';
import { PackageCheck, Wallet, CalendarDays, XCircle, CheckCircle2, Loader2, Circle } from 'lucide-react';
import { Booking, ProcStatus } from '../../procurement/types';
import { formatQty, prettyDate } from '../../procurement/logic';
import type { TFn } from '../../procurement/i18n';
import { BackBar, BookingPicker, BookingStatusPill, Card, EmptyState, primaryBtn } from './ui';

const STEPS: { status: ProcStatus; instant: boolean }[] = [
  { status: 'BOOKED', instant: true },
  { status: 'ARRIVED', instant: true },
  { status: 'WEIGHING', instant: false },
  { status: 'QUALITY_CHECK', instant: false },
  { status: 'ACCEPTED', instant: true },
  { status: 'PAYMENT_PROCESSING', instant: false },
  { status: 'PAYMENT_COMPLETED', instant: true },
];

type StepState = 'done' | 'active' | 'pending';

function stepStates(status: ProcStatus): StepState[] {
  // REJECTED sits after quality check; CANCELLED never progressed past booking.
  const idx = status === 'REJECTED' ? 3 : status === 'CANCELLED' ? -1 : STEPS.findIndex(s => s.status === status);
  return STEPS.map((s, i) => {
    if (i < idx) return 'done';
    if (i === idx) return status === 'REJECTED' ? 'done' : s.instant ? 'done' : 'active';
    return 'pending';
  });
}

const TimeStr = (at?: number) =>
  at ? new Date(at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

interface CommonProps {
  t: TFn;
  bookings: Booking[];
  current?: Booking;
  onSelect: (id: string) => void;
  onBack: () => void;
  onBook: () => void;
}

export const StatusTimeline: React.FC<CommonProps> = ({ t, bookings, current, onSelect, onBack, onBook }) => {
  if (!current) {
    return (
      <div className="space-y-4">
        <BackBar title={t('procStatus')} onBack={onBack} />
        <EmptyState
          icon={<PackageCheck className="w-6 h-6" />} title={t('noBookingYet')} text={t('noBookingHint')}
          action={<button onClick={onBook} className={primaryBtn}><CalendarDays className="w-4 h-4" />{t('bookSlot')}</button>}
        />
      </div>
    );
  }
  const b = current;
  const states = stepStates(b.status);
  const at = (s: ProcStatus) => b.history.find(h => h.status === s)?.at;

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">
      <BackBar title={t('procStatus')} subtitle={`${b.centreName} · ${prettyDate(b.date)}`} onBack={onBack} right={<BookingStatusPill status={b.status} t={t} />} />
      <BookingPicker bookings={bookings} selectedId={b.id} onSelect={onSelect} t={t} />

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span dir="ltr" className="text-base font-black font-mono">{b.token}</span>
          <span className="text-xs font-bold text-stone-600">{t(`crop_${b.crop}` as never) || b.crop} · <span dir="ltr">{formatQty(b)}</span></span>
        </div>

        {b.status === 'CANCELLED' && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold mb-3"><XCircle className="w-4 h-4" />{t('bookingCancelled')}</div>
        )}
        {b.status === 'REJECTED' && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold mb-3 space-y-1">
            <div className="flex items-center gap-2"><XCircle className="w-4 h-4" />{t('produceRejected')}</div>
            {b.note && <p className="font-medium">{b.note}</p>}
          </div>
        )}

        <ol>
          {STEPS.map((s, i) => {
            const state = states[i];
            const last = i === STEPS.length - 1;
            const label = state === 'done' ? t(`tl_${s.status}_done` as never) : t(`tl_${s.status}_active` as never);
            const time = TimeStr(at(s.status));
            return (
              <li key={s.status} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    state === 'done' ? 'bg-emerald-500 text-white' : state === 'active' ? 'bg-amber-400 text-white' : 'bg-stone-200 text-stone-400'
                  }`}>
                    {state === 'done' ? <CheckCircle2 className="w-4 h-4" /> : state === 'active' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Circle className="w-3.5 h-3.5" />}
                  </span>
                  {!last && <span className={`w-0.5 flex-1 min-h-6 ${state === 'done' ? 'bg-emerald-300' : 'bg-stone-200'}`} />}
                </div>
                <div className="pb-4 pt-1">
                  <div className={`text-sm font-extrabold ${state === 'pending' ? 'text-stone-400' : 'text-stone-900'}`}>
                    {state === 'done' ? '🟢' : state === 'active' ? '🟡' : '⚪'} {label}
                  </div>
                  {time && state !== 'pending' && <div dir="ltr" className="text-[11px] text-stone-400 text-start">{time}</div>}
                </div>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
};

const PAY_STEPS: { key: 'PENDING' | 'PROCESSING' | 'COMPLETED' }[] = [{ key: 'PENDING' }, { key: 'PROCESSING' }, { key: 'COMPLETED' }];

export const PaymentStatusView: React.FC<CommonProps> = ({ t, bookings, current, onSelect, onBack, onBook }) => {
  if (!current) {
    return (
      <div className="space-y-4">
        <BackBar title={t('payStatus')} onBack={onBack} />
        <EmptyState
          icon={<Wallet className="w-6 h-6" />} title={t('noBookingYet')} text={t('noBookingHint')}
          action={<button onClick={onBook} className={primaryBtn}><CalendarDays className="w-4 h-4" />{t('bookSlot')}</button>}
        />
      </div>
    );
  }
  const b = current;
  const stage = b.paymentStatus === 'COMPLETED' ? 2 : b.paymentStatus === 'PROCESSING' ? 1 : 0;
  const na = b.paymentStatus === 'NOT_APPLICABLE';
  const acceptedYet = ['ACCEPTED', 'PAYMENT_PROCESSING', 'PAYMENT_COMPLETED'].includes(b.status);

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">
      <BackBar title={t('payStatus')} subtitle={`${b.centreName} · ${prettyDate(b.date)}`} onBack={onBack} />
      <BookingPicker bookings={bookings} selectedId={b.id} onSelect={onSelect} t={t} />

      <Card className="p-5 text-center space-y-2">
        <div className="text-[11px] font-black uppercase tracking-widest text-stone-400">{t('payStatus')}</div>
        <div className="text-xl font-black text-stone-900">
          {na ? '⚫' : stage === 2 ? '🟢' : stage === 1 ? '🟡' : '⚪'} {t(`pay_${b.paymentStatus}` as never)}
        </div>
        {b.amount != null && !na && (
          <div className="text-3xl font-black text-emerald-700" dir="ltr">₹{b.amount.toLocaleString('en-IN')}</div>
        )}
        <p className="text-xs text-stone-500">
          {na ? t('payNA') : stage === 2 ? t('payDoneHint') : stage === 1 ? t('payProcessingHint') : acceptedYet ? t('payAcceptedHint') : t('payPendingHint')}
        </p>
      </Card>

      {!na && (
        <Card className="p-4">
          <div className="flex items-center" dir="ltr">
            {PAY_STEPS.map((s, i) => (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center gap-1 w-20">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i < stage || (i === stage && stage === 2) ? 'bg-emerald-500 text-white' : i === stage ? 'bg-amber-400 text-white' : 'bg-stone-200 text-stone-400'
                  }`}>
                    {i < stage || (i === stage && stage === 2) ? <CheckCircle2 className="w-4 h-4" /> : i === stage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Circle className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-[10px] font-bold text-stone-600 text-center leading-tight">{t(`pay_${s.key}` as never)}</span>
                </div>
                {i < PAY_STEPS.length - 1 && <span className={`flex-1 h-0.5 -mt-4 ${i < stage ? 'bg-emerald-300' : 'bg-stone-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4 divide-y divide-stone-100">
        {[
          [t('token'), <span dir="ltr" className="font-mono">{b.token}</span>],
          [t('crop'), t(`crop_${b.crop}` as never) || b.crop],
          [t('quantity'), <span dir="ltr">{formatQty(b)}</span>],
          [t('procStatus'), t(`st_${b.status}` as never)],
        ].map(([k, v], i) => (
          <div key={i} className="flex justify-between py-1.5 text-sm">
            <span className="text-[11px] font-bold uppercase tracking-wide text-stone-400">{k}</span>
            <span className="font-extrabold text-stone-900">{v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};
