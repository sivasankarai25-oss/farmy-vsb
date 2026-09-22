import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, XCircle, Loader2, CalendarDays } from 'lucide-react';
import { Booking, Centre, QueueEntry } from '../../procurement/types';
import { formatQty, prettyDate, qrPayload, queueInfo } from '../../procurement/logic';
import { cancelBooking } from '../../procurement/service';
import type { TFn } from '../../procurement/i18n';
import { BackBar, BookingPicker, BookingStatusPill, Card, EmptyState, ErrorBox, primaryBtn } from './ui';

interface Props {
  t: TFn;
  bookings: Booking[];
  current?: Booking;
  centres: Centre[];
  queue: QueueEntry[];
  onSelect: (id: string) => void;
  onBack: () => void;
  onBook: () => void;
  onOpenQueue: () => void;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 py-1.5">
    <span className="text-[11px] font-bold uppercase tracking-wide text-stone-400">{label}</span>
    <span className="text-sm font-extrabold text-stone-900 text-end">{value}</span>
  </div>
);

export const TokenTicket: React.FC<Props> = ({ t, bookings, current, centres, queue, onSelect, onBack, onBook, onOpenQueue }) => {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!current) {
    return (
      <div className="space-y-4">
        <BackBar title={t('myToken')} onBack={onBack} />
        <EmptyState
          icon={<Ticket className="w-6 h-6" />} title={t('noBookingYet')} text={t('noBookingHint')}
          action={<button onClick={onBook} className={primaryBtn}><CalendarDays className="w-4 h-4" />{t('bookSlot')}</button>}
        />
      </div>
    );
  }

  const b = current;
  const info = queueInfo(queue, b, centres.find(c => c.id === b.centreId));
  const cancel = async () => {
    setBusy(true); setErr(null);
    try { await cancelBooking(b); setConfirming(false); }
    catch (e: any) { setErr(e?.code === 'permission-denied' ? 'PERMISSION' : t('errNotCancellable')); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">
      <BackBar title={t('myToken')} onBack={onBack} />
      <BookingPicker bookings={bookings} selectedId={b.id} onSelect={onSelect} t={t} />

      {/* Digital ticket */}
      <div className="rounded-3xl overflow-hidden shadow-lg border border-emerald-900/10 bg-white">
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white px-5 py-4 text-center">
          <div className="text-lg font-black tracking-[0.25em]">FARMY</div>
          <div className="text-[11px] font-bold tracking-widest text-emerald-200">{t('ticketSubtitle')}</div>
        </div>

        <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wide text-stone-400">{t('token')}</div>
            <div dir="ltr" className="text-3xl font-black font-mono text-stone-900 text-start">{b.token}</div>
            <div className="mt-1.5"><BookingStatusPill status={b.status} t={t} /></div>
          </div>
          <div className="p-2 bg-white border border-stone-200 rounded-xl shrink-0" aria-label="QR code">
            <QRCodeSVG value={qrPayload(b)} size={96} level="M" />
          </div>
        </div>

        <div className="mx-5 border-t-2 border-dashed border-stone-200 relative">
          <span className="absolute -start-[30px] -top-2.5 w-5 h-5 rounded-full bg-stone-100" />
          <span className="absolute -end-[30px] -top-2.5 w-5 h-5 rounded-full bg-stone-100" />
        </div>

        <div className="px-5 py-3 divide-y divide-stone-100">
          <Row label={t('farmer')} value={b.farmerName} />
          <Row label={t('crop')} value={t(`crop_${b.crop}` as never) || b.crop} />
          <Row label={t('quantity')} value={<span dir="ltr">{b.quantity} {t(`unit_${b.unit}` as never)}</span>} />
          <Row label={t('centre')} value={b.centreName} />
          <Row label={t('date')} value={prettyDate(b.date)} />
          <Row label={t('time')} value={<span dir="ltr">{b.slotLabel}</span>} />
          {b.status === 'BOOKED' || b.status === 'ARRIVED' ? (
            <Row label={t('queuePosition')} value={info.position ?? '…'} />
          ) : null}
          <Row label={t('status')} value={t(`st_${b.status}` as never)} />
        </div>

        <div className="px-5 pb-5 pt-1 text-center text-[11px] text-stone-500">{t('showQrHint')}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={onOpenQueue} className={primaryBtn}>{t('liveQueue')}</button>
        <button onClick={onBook} className="px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-800 font-black text-sm hover:bg-stone-50">{t('bookAnother')}</button>
      </div>

      {b.status === 'BOOKED' && (
        confirming ? (
          <Card className="p-4 space-y-3 border-red-200">
            <p className="text-xs font-bold text-red-800">{t('cancelConfirm')}</p>
            {err && <ErrorBox error={err} t={t} />}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setConfirming(false)} className="py-2.5 rounded-xl border border-stone-300 text-xs font-black">{t('keepBooking')}</button>
              <button onClick={cancel} disabled={busy} className="py-2.5 rounded-xl bg-red-600 text-white text-xs font-black flex items-center justify-center gap-1.5">
                {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}{t('yesCancel')}
              </button>
            </div>
          </Card>
        ) : (
          <button onClick={() => setConfirming(true)} className="w-full py-2.5 text-xs font-extrabold text-red-700 flex items-center justify-center gap-1.5">
            <XCircle className="w-4 h-4" /> {t('cancelBooking')}
          </button>
        )
      )}
    </div>
  );
};
